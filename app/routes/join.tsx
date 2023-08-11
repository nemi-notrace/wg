import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { prisma } from "~/db.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

type ActionReturnData = {
  errors: {
    email?: string;
    password?: string;
    inviteCode?: string;
  };
};
export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const inviteCodeProvided = formData.get("inviteCode") as string;
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (inviteCodeProvided === process.env.FIRST_USER_INVITE_CODE) {
    const envInviteCodeUsed = await prisma.inviteCode.findUnique({
      where: { code: process.env.FIRST_USER_INVITE_CODE },
    });

    if (envInviteCodeUsed && envInviteCodeUsed.used) {
      return json(
        {
          errors: {
            inviteCode: "Invalid or already used invite code.",
            email: null,
            password: null,
          },
        },
        { status: 400 }
      );
    }

    await prisma.inviteCode.create({
      data: {
        code: process.env.FIRST_USER_INVITE_CODE,
        used: true,
      },
    });
  } else {
    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code: inviteCodeProvided },
    });

    if (!inviteCode || inviteCode.used) {
      return json(
        {
          errors: {
            inviteCode: "Invalid or already used invite code.",
            email: null,
            password: null,
          },
        },
        { status: 400 }
      );
    }

    await prisma.inviteCode.update({
      where: { code: inviteCodeProvided },
      data: { used: true },
    });
  }
  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
          inviteCode: "Invalid or expired invite code",
        },
      },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<ActionReturnData>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const inviteCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.inviteCode) {
      inviteCodeRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
      <div>
        <Form method="post">
          <div>
            <label htmlFor="email">Email address</label>
            <div>
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
              />
              {actionData?.errors?.email ? (
                <div id="email-error">{actionData.errors.email}</div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <div>
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
              />
              {actionData?.errors?.password ? (
                <div id="password-error">{actionData.errors.password}</div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="inviteCode">Invite Code</label>
            <div>
              <input
                id="inviteCode"
                ref={inviteCodeRef}
                name="inviteCode"
                type="text"
                aria-invalid={actionData?.errors?.inviteCode ? true : undefined}
                aria-describedby="inviteCode-error"
              />
              {actionData?.errors?.inviteCode ? (
                <div id="inviteCode-error">{actionData.errors.inviteCode}</div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit">Create Account</button>
          <div>
            <div>
              Already have an account?{" "}
              <Link
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

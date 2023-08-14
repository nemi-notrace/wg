import { Form, useActionData, useRouteLoaderData } from "@remix-run/react";
import { ActionArgs, json } from "@remix-run/node";
import { createInviteCode } from "~/models/user.server";

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const formDataObj: any = {};
  for (let [key, value] of body.entries()) {
    formDataObj[key] = value;
  }
  console.log("body", formDataObj);
  const userId = body.get("userId");
  if (!userId) {
    return json({ error: "User ID is missing." }, { status: 400 });
  }

  try {
    const invite = await createInviteCode(userId.toString());
    return json({ code: invite.code });
  } catch (error) {
    return json({ error: "Failed to generate invite code." }, { status: 500 });
  }
}

export default function InviteCodeRoute() {
  const { user } = useRouteLoaderData("root");
  const actiondata = useActionData<typeof action>();
  console.log("actiondata", actiondata);
  return (
    <div>
      <Form method="post">
        <input type="hidden" name="userId" value={user?.id || ""} />
        <button type="submit">Generate Invite Code</button>
        {actiondata && "code" in actiondata && (
          <p>Invite Code: {actiondata.code}</p>
        )}
      </Form>
    </div>
  );
}

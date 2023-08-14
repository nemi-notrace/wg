import { redirect, ActionFunction } from "@remix-run/node";
import { createHousehold, addUserToHousehold } from "~/models/houshold.server"; // Ensure this path is correct
import { useRouteLoaderData, Form } from "@remix-run/react";
export let action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const userId = formData.get("userId");
  console.log("userId", userId);
  if (!userId) return redirect("/error"); // Handle missing userId

  const newHousehold = await createHousehold();
  console.log("newHousehold", newHousehold);
  await addUserToHousehold(userId, newHousehold.id);
  return redirect("/");
};

export default function CreateHousehold() {
  const { user } = useRouteLoaderData("root");

  return (
    <div>
      <h1>Create a New Household</h1>
      <Form method="post" action="/households">
        <input type="hidden" name="userId" value={user?.id || ""} />
        <button type="submit">Create Household</button>
      </Form>
    </div>
  );
}

import { redirect, ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  addUserToHousehold,
  createHousehold,
  getAllHouseholds,
} from "~/models/houshold.server";
import { useRouteLoaderData, Form, useLoaderData } from "@remix-run/react";

export let loader: LoaderFunction = async () => {
  const households = await getAllHouseholds();
  return { households };
};

export let action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const userId = formData.get("userId");
  const householdId = formData.get("householdId");
  const householdName = formData.get("householdName");
  if (!userId) return redirect("/error"); // Handle missing userId or householdId

  if (householdId) {
    // Add user to an existing household
    await addUserToHousehold(userId, householdId);
  } else {
    // Create a new household
    const newHousehold = await createHousehold(householdName || "");
    await addUserToHousehold(userId, newHousehold.id);
  }
  return redirect("/");
};

export default function CreateHousehold() {
  const { households } = useLoaderData();
  const { user } = useRouteLoaderData("root");

  return (
    <div>
      <h1>Create a New Household</h1>
      <Form method="post" action="/households">
        <input type="hidden" name="userId" value={user?.id || ""} />
        <input
          type="text"
          name="householdName"
          placeholder="Household Name (optional)"
        />
        <button type="submit">Create Household</button>
      </Form>
      <h2>Add to Household</h2>
      <Form method="post" action="/households">
        <input type="hidden" name="userId" value={user?.id || ""} />
        <select name="householdId" required>
          {households.map((household: any) => (
            <option key={household.id} value={household.id}>
              {household.name || `Household ${household.id}`}
            </option>
          ))}
        </select>
        <button type="submit">Add to Household</button>
      </Form>
    </div>
  );
}

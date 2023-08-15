import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { getUser } from "session.server";
import {
  createTransaction,
  getAllHousholdsOfUser,
  getHouseholdById,
  getTransactionsByUserAndHousehold,
} from "~/models/houshold.server";
import { HouseholdTransactions } from "./households.$householdId";
import { parse } from "url";

export const loader: LoaderFunction = async ({ request, context }) => {
  const currentUser = await getUser(request);
  if (!currentUser) {
    return null;
  }
  const currentUsersHouseholds = await getAllHousholdsOfUser(currentUser.id);
  const households = await Promise.all(
    currentUsersHouseholds.map((household) => {
      return getHouseholdById(household.householdId);
    })
  );
  const { query } = parse(request.url, true);

  const userId = query.userId?.toString() || currentUser.id || "";
  const householdId = query.householdId?.toString() || households[0]?.id || "";
  const transactions = await getTransactionsByUserAndHousehold(
    userId,
    householdId
  );

  return { households, currentUser, transactions };
};
export let action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const data = {
    userId: formData.get("userId"),
    householdId: formData.get("householdId"),
    date: new Date(formData.get("date") || Date.now()),
    type: formData.get("type"),
    amount: Number(formData.get("amount")),
  };
  await createTransaction(data);

  return redirect(`/transactions_new`);
};
export default function TransactionsNew() {
  const { households, currentUser, transactions } = useLoaderData();
  const [selectedHousehold, setSelectedHousehold] = useState(households[0]);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleHouseholdChange = (e) => {
    const selected = households.find(
      (household) => household.id === e.target.value
    );
    setSelectedHousehold(selected);
    handleSelectChange(e);
  };
  const currentDate = new Date().toISOString().split("T")[0];
  const handleSelectChange = (e: any) => {
    const params = new URLSearchParams(window.location.search);
    params.set(e.target.name, e.target.value);
    setSearchParams(params);
  };

  return (
    <div>
      <Form method="post" action="/logout">
        <button type="submit">Logout</button>
      </Form>
      <Form method="post">
        <select
          name="householdId"
          defaultValue={selectedHousehold ? selectedHousehold.id : ""}
          required
          onChange={handleHouseholdChange}
        >
          {households.map((household: any) => (
            <option key={household.id} value={household.id}>
              {household.id + " " + household.name}
            </option>
          ))}
        </select>

        <select
          name="userId"
          defaultValue={currentUser.id}
          onChange={handleSelectChange}
        >
          {selectedHousehold &&
            selectedHousehold.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.userId}
              </option>
            ))}
        </select>
        <input type="date" name="date" required defaultValue={currentDate} />
        <input type="text" name="type" defaultValue="Ausgabe" />
        <input type="number" name="amount" placeholder="Amount" required />
        <button type="submit">Add Transaction</button>
      </Form>
      <HouseholdTransactions transactions={transactions} />
    </div>
  );
}

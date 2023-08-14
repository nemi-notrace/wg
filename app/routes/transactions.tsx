import { useLoaderData, Form, useSearchParams } from "@remix-run/react";
import { getAllUsers } from "~/models/user.server";
import {
  getAllHouseholds,
  getTransactionsByUserAndHousehold,
} from "~/models/houshold.server";
import { LoaderFunction } from "@remix-run/node";
import { useEffect } from "react";
import { HouseholdTransactions } from "./households.$householdId";
import { parse } from "url";

export let loader: LoaderFunction = async ({ request }) => {
  const users = await getAllUsers();
  const households = await getAllHouseholds();

  const { query } = parse(request.url, true);

  const userId = query.userId?.toString() || users[0]?.id || "";
  const householdId = parseInt(
    query.householdId?.toString() || households[0]?.id || "",
    10
  );

  const transactions = await getTransactionsByUserAndHousehold(
    userId,
    householdId
  );
  return { users, households, transactions };
};

export default function Transactions() {
  const { users, households, transactions } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedUserId = searchParams.get("userId") || users[0]?.id || "";
  const selectedHouseholdId =
    searchParams.get("householdId") || households[0]?.id || "";

  const currentDate = new Date().toISOString().split("T")[0];

  const handleSelectChange = (e) => {
    setSearchParams((prevParams) => ({
      ...Array.from(prevParams.entries()).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {}
      ),
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    let newParams = {};

    if (!selectedUserId && users.length) {
      newParams.userId = users[0].id;
    }
    if (!selectedHouseholdId && households.length) {
      newParams.householdId = households[0].id;
    }

    setSearchParams(newParams);
  }, [users, households]);

  return (
    <div>
      <Form action="/logout" method="post">
        <button type="submit">Logout</button>
      </Form>
      <Form method="post">
        <select
          name="userId"
          required
          defaultValue={selectedUserId}
          onChange={handleSelectChange}
        >
          {users.map((u: any) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>
        <select
          name="householdId"
          required
          defaultValue={selectedHouseholdId}
          onChange={handleSelectChange}
        >
          {households.map((household: any) => (
            <option key={household.id} value={household.id}>
              Household {household.id}
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

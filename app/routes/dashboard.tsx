import { Form, Link, useRouteLoaderData } from "@remix-run/react";

export default function Dashboard() {
  const { user } = useRouteLoaderData("root");

  return (
    <div>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
      {user && <Link to="/generate-invite">Generate Invite Code</Link>}
      {user && <Link to="/households">Households</Link>}
      {user && <Link to="/transactions">Transactions</Link>}
    </div>
  );
}

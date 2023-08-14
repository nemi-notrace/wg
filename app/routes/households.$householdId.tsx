import { Link } from "@remix-run/react";

export function HouseholdTransactions(props: any) {
  return (
    <div>
      <h1>Transactions for Household {props.householdId}</h1>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>
              <Link to="?sortBy=date&order=asc">Date &#9650;</Link>
              <Link to="?sortBy=date&order=desc">Date &#9660;</Link>
            </th>
            <th>Type</th>
            <th>
              <Link to="?sortBy=amount&order=asc">Amount &#9650;</Link>
              <Link to="?sortBy=amount&order=desc">Amount &#9660;</Link>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* {props.transactions.map((transaction: any) => (
            <tr key={transaction.id}>
              <td>{transaction.user.email}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.type}</td>
              <td>{transaction.amount}</td>
              <td>
                <Link to={`/transactions/${transaction.id}`}>View</Link>
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
}

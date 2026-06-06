import { useEffect, useState } from "react";
import API from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("customers/"),
      API.get("accounts/"),
      API.get("transactions/"),
    ])
      .then(([customersRes, accountsRes, transactionsRes]) => {
        setCustomers(customersRes.data);
        setAccounts(accountsRes.data);
        setTransactions(transactionsRes.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <h4 className="mt-3">
          Loading Dashboard...
        </h4>
      </div>
    );
  }

  const totalBalance = accounts.reduce(
    (sum, account) => sum + parseFloat(account.balance || 0),
    0
  );

  const depositCount = transactions.filter(
    (t) => t.transaction_type === "Deposit"
  ).length;

  const withdrawCount = transactions.filter(
    (t) => t.transaction_type === "Withdraw"
  ).length;

  const transferCount = transactions.filter(
    (t) => t.transaction_type === "Transfer"
  ).length;

  const chartData = [
    {
      name: "Deposit",
      value: depositCount,
    },
    {
      name: "Withdraw",
      value: withdrawCount,
    },
    {
      name: "Transfer",
      value: transferCount,
    },
  ];

  const COLORS = [
    "#28a745",
    "#dc3545",
    "#0d6efd",
  ];

  return (
    <div className="container mt-4">

      <h1 className="text-center mb-4">
        🏦 Bank Management Dashboard
      </h1>

      {/* Summary Cards */}

      <div className="row g-4">

        <div className="col-md-3">
          <div className="card bg-success text-white shadow border-0">
            <div className="card-body text-center">
              <h1>{customers.length}</h1>
              <h5>Total Customers</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-primary text-white shadow border-0">
            <div className="card-body text-center">
              <h1>{accounts.length}</h1>
              <h5>Total Accounts</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-warning shadow border-0">
            <div className="card-body text-center">
              <h1>{transactions.length}</h1>
              <h5>Total Transactions</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-danger text-white shadow border-0">
            <div className="card-body text-center">
              <h4>₹ {totalBalance.toFixed(2)}</h4>
              <h5>Total Bank Balance</h5>
            </div>
          </div>
        </div>

      </div>

      {/* Pie Chart */}

      <div className="card shadow mt-5">
        <div className="card-header">
          <h4>Transaction Statistics</h4>
        </div>

        <div className="card-body">

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>
      </div>

      {/* Recent Transactions */}

      <div className="card shadow mt-5">

        <div className="card-header">
          <h4>Recent Transactions</h4>
        </div>

        <div className="card-body">

          <table className="table table-striped table-hover">

            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Account</th>
              </tr>
            </thead>

            <tbody>

              {transactions
                .slice(-5)
                .reverse()
                .map((transaction) => (
                  <tr key={transaction.id}>

                    <td>{transaction.id}</td>

                    <td>
                      {transaction.transaction_type === "Deposit" && (
                        <span className="badge bg-success">
                          Deposit
                        </span>
                      )}

                      {transaction.transaction_type === "Withdraw" && (
                        <span className="badge bg-danger">
                          Withdraw
                        </span>
                      )}

                      {transaction.transaction_type === "Transfer" && (
                        <span className="badge bg-primary">
                          Transfer
                        </span>
                      )}
                    </td>

                    <td>
                      ₹ {transaction.amount}
                    </td>

                    <td>
                      {transaction.account}
                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
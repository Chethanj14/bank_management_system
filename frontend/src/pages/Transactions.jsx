import { useEffect, useState } from "react";
import API from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("transactions/")
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading Transactions...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Transactions</h1>

        <button
          className="btn btn-success"
          onClick={() =>
            window.open(
              "http://127.0.0.1:8000/api/export-transactions/"
            )
          }
        >
          📥 Export CSV
        </button>
      </div>

      <div className="card shadow">
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

              {transactions.length > 0 ? (
                transactions.map((transaction) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Transactions Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Transactions;
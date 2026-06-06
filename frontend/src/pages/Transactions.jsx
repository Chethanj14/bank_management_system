import { useEffect, useState } from "react";
import API from "../services/api";

function Transactions() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [accountSearch, setAccountSearch] = useState("");

  const [sortOrder, setSortOrder] = useState("");

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

  const filteredTransactions = transactions
    .filter((transaction) => {

      const matchesType =
        typeFilter === "" ||
        transaction.transaction_type === typeFilter;

      const matchesMin =
        minAmount === "" ||
        Number(transaction.amount) >= Number(minAmount);

      const matchesMax =
        maxAmount === "" ||
        Number(transaction.amount) <= Number(maxAmount);

      const matchesAccount =
        accountSearch === "" ||
        transaction.account
          .toString()
          .includes(accountSearch);

      const transactionDate =
        transaction.created_at?.split("T")[0];

      const matchesFromDate =
        fromDate === "" ||
        transactionDate >= fromDate;

      const matchesToDate =
        toDate === "" ||
        transactionDate <= toDate;

      return (
        matchesType &&
        matchesMin &&
        matchesMax &&
        matchesAccount &&
        matchesFromDate &&
        matchesToDate
      );
    })
    .sort((a, b) => {

      if (sortOrder === "low") {
        return (
          Number(a.amount) -
          Number(b.amount)
        );
      }

      if (sortOrder === "high") {
        return (
          Number(b.amount) -
          Number(a.amount)
        );
      }

      return 0;
    });

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

      {/* Filter Row 1 */}

      <div className="row mb-3">

        <div className="col-md-4">
          <select
            className="form-control"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="">
              All Types
            </option>

            <option value="Deposit">
              Deposit
            </option>

            <option value="Withdraw">
              Withdraw
            </option>

            <option value="Transfer">
              Transfer
            </option>

          </select>
        </div>

        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Min Amount"
            value={minAmount}
            onChange={(e) =>
              setMinAmount(e.target.value)
            }
          />
        </div>

        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Max Amount"
            value={maxAmount}
            onChange={(e) =>
              setMaxAmount(e.target.value)
            }
          />
        </div>

      </div>

      {/* Filter Row 2 */}

      <div className="row mb-4">

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
          />
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) =>
              setToDate(e.target.value)
            }
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Account Number"
            value={accountSearch}
            onChange={(e) =>
              setAccountSearch(e.target.value)
            }
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
          >
            <option value="">
              Sort Amount
            </option>

            <option value="low">
              Low → High
            </option>

            <option value="high">
              High → Low
            </option>

          </select>
        </div>

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
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.length > 0 ? (

                filteredTransactions.map(
                  (transaction) => (
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

                      <td>
                        {transaction.created_at
                          ? transaction.created_at.split("T")[0]
                          : "N/A"}
                      </td>

                    </tr>
                  )
                )

              ) : (

                <tr>
                  <td
                    colSpan="5"
                    className="text-center"
                  >
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
import { useEffect, useState } from "react";
import API from "../services/api";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("accounts/")
      .then((res) => setAccounts(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.account_number
        .toString()
        .includes(search) ||
      account.account_type
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <h4 className="mt-3">
          Loading Accounts...
        </h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h1 className="text-center mb-4">
        🏦 Accounts
      </h1>

      <div className="card shadow mb-4">
        <div className="card-body">

          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search Account Number or Type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>
      </div>

      <div className="alert alert-info">
        Total Accounts:
        <strong> {filteredAccounts.length}</strong>
      </div>

      <div className="card shadow">

        <div className="card-header">
          <h4>Account List</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered table-striped table-hover">

            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Account Number</th>
                <th>Account Type</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>

              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.id}</td>
                    <td>{account.account_number}</td>
                    <td>{account.account_type}</td>
                    <td>₹ {account.balance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center"
                  >
                    No Accounts Found
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

export default Accounts;
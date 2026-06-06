import { useState } from "react";
import API from "../services/api";

function Deposit() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await API.post("deposit/", {
        account_number: accountNumber,
        amount: amount,
      });

      setMessage(
        `✅ Deposit Successful! New Balance: ₹${res.data.new_balance}`
      );

      setAccountNumber("");
      setAmount("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "❌ Deposit Failed. Please check details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow p-4 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4 text-success">
          💰 Deposit Money
        </h2>

        <form onSubmit={handleDeposit}>
          <div className="mb-3">
            <label className="form-label">
              Account Number
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Amount
            </label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Processing..." : "Deposit"}
          </button>
        </form>

        {message && (
          <div className="alert alert-success mt-3">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Deposit;
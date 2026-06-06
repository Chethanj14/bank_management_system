import { useState } from "react";
import API from "../services/api";

function Withdraw() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await API.post("withdraw/", {
        account_number: accountNumber,
        amount: amount,
      });

      setMessage(
        `✅ Withdraw Successful! New Balance: ₹${res.data.new_balance}`
      );

      setAccountNumber("");
      setAmount("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "❌ Insufficient Balance or Invalid Account"
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
        <h2 className="text-center mb-4 text-danger">
          💸 Withdraw Money
        </h2>

        <form onSubmit={handleWithdraw}>
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
            className="btn btn-danger w-100"
            disabled={loading}
          >
            {loading ? "Processing..." : "Withdraw"}
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

export default Withdraw;
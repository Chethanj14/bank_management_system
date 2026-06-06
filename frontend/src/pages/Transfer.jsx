import { useState } from "react";
import API from "../services/api";

function Transfer() {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (fromAccount === toAccount) {
      setError(
        "❌ Sender and Receiver account cannot be the same."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("transfer/", {
        from_account: fromAccount,
        to_account: toAccount,
        amount: amount,
      });

      setMessage(
        `✅ Transfer Successful!

Amount Transferred: ₹${amount}

Sender Account: ${fromAccount}
Receiver Account: ${toAccount}

Sender Balance: ₹${res.data.sender_balance}

Receiver Balance: ₹${res.data.receiver_balance}

📧 Email notifications sent successfully.`
      );

      setFromAccount("");
      setToAccount("");
      setAmount("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "❌ Transfer Failed. Please check details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <div
        className="card shadow p-4 mx-auto"
        style={{ maxWidth: "700px" }}
      >

        <h2 className="text-center mb-4 text-primary">
          🔄 Transfer Money
        </h2>

        <form onSubmit={handleTransfer}>

          <div className="mb-3">
            <label className="form-label">
              From Account
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Sender Account Number"
              value={fromAccount}
              onChange={(e) =>
                setFromAccount(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              To Account
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Receiver Account Number"
              value={toAccount}
              onChange={(e) =>
                setToAccount(e.target.value)
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
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? "Processing Transfer..."
              : "Transfer"}
          </button>

        </form>

        {message && (
          <div className="alert alert-success mt-3">
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
              }}
            >
              {message}
            </pre>
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

export default Transfer;
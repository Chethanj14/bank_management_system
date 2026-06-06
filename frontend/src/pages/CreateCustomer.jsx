import { useState } from "react";
import API from "../services/api";

function CreateCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    aadhaar_number: "",
    pan_number: "",
    account_type: "Savings",
    initial_deposit: 0,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await API.post(
        "create-customer/",
        formData
      );

      setMessage(
        `Customer Created Successfully! Account Number: ${res.data.account_number}`
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        aadhaar_number: "",
        pan_number: "",
        account_type: "Savings",
        initial_deposit: 0,
      });

    } catch (err) {

      console.log("Backend Error:", err.response);

      const errorMessage =
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message;

      setError(errorMessage);

      alert(errorMessage);
    }
  };

  return (
    <div className="container mt-4">

      <div className="card shadow p-4">

        <h2 className="mb-4">
          Create Customer
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            className="form-control mb-3"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            className="form-control mb-3"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <textarea
            className="form-control mb-3"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            name="aadhaar_number"
            placeholder="Aadhaar Number"
            value={formData.aadhaar_number}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            name="pan_number"
            placeholder="PAN Number"
            value={formData.pan_number}
            onChange={handleChange}
            required
          />

          <select
            className="form-control mb-3"
            name="account_type"
            value={formData.account_type}
            onChange={handleChange}
          >
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>

          <input
            type="number"
            className="form-control mb-3"
            name="initial_deposit"
            placeholder="Initial Deposit"
            value={formData.initial_deposit}
            onChange={handleChange}
            required
          />

          <button
            className="btn btn-success"
            type="submit"
          >
            Create Customer
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

export default CreateCustomer;
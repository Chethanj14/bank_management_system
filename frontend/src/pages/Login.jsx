import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await API.post(
        "/token/",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.access
      );

      localStorage.setItem(
        "refresh",
        res.data.refresh
      );

      setMessage("Login Successful");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (err) {
      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="container mt-5">

      <div
        className="card shadow p-4 mx-auto"
        style={{ maxWidth: "450px" }}
      >

        <h2 className="text-center mb-4">
          🔐 Login
        </h2>

        <form onSubmit={handleLogin}>

          <div className="mb-3">
            <label className="form-label">
              Username
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
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

        <div className="mt-3 text-center">

         

        </div>

      </div>

    </div>
  );
}

export default Login;
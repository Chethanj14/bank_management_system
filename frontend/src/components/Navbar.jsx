import { Link } from "react-router-dom";

function Navbar() {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");

    alert("Logged Out Successfully");

    // Redirect to Login Page
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">

        <Link className="navbar-brand fw-bold" to="/">
          🏦 Bank Management
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/customers">
                Customers
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/accounts">
                Accounts
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/transactions">
                Transactions
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/deposit">
                Deposit
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/withdraw">
                Withdraw
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/transfer">
                Transfer
              </Link>
            </li>

            <li className="nav-item ms-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
import { useEffect, useState } from "react";
import API from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("customers/")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <h4 className="mt-3">
          Loading Customers...
        </h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h1 className="mb-4 text-center">
        👥 Customers
      </h1>

      <div className="card shadow mb-4">
        <div className="card-body">

          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search Customer Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>
      </div>

      <div className="alert alert-info">
        Total Customers: <strong>{filteredCustomers.length}</strong>
      </div>

      <div className="row">

        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div
              className="col-md-4 mb-4"
              key={customer.id}
            >
              <div className="card shadow border-0 h-100">

                <div className="card-body">

                  <h4 className="card-title">
                    {customer.name}
                  </h4>

                  <p className="text-muted">
                    📧 {customer.email}
                  </p>

                  <p>
                    <strong>ID:</strong> {customer.id}
                  </p>

                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <h5>No Customer Found</h5>
          </div>
        )}

      </div>

    </div>
  );
}

export default Customers;
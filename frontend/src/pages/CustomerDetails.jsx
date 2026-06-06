import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function CustomerDetails() {

  const { id } = useParams();

  const [customer, setCustomer] = useState(null);

  useEffect(() => {

    API.get(`customers/${id}/`)
      .then((res) => {
        setCustomer(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [id]);

  if (!customer) {
    return (
      <div className="container mt-5">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="card shadow p-4">

        <h2>
          Customer Details
        </h2>

        <hr />

        <p>
          <strong>Name:</strong>{" "}
          {customer.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {customer.email}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {customer.phone}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {customer.address}
        </p>

        <p>
          <strong>Aadhaar:</strong>{" "}
          {customer.aadhaar_number}
        </p>

        <p>
          <strong>PAN:</strong>{" "}
          {customer.pan_number}
        </p>

      </div>

    </div>
  );
}

export default CustomerDetails;
import React, { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import axios from "axios";

interface Invoice {
  id: Number
  number: String
}

const Invoices: React.FC = () => {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:5000/api/invoices.json`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': "application/json", Accept: 'application/json'},
        })
        .then((res) => setInvoices(res.data))
        .catch((err) => console.error("API Error", err));
    }
  }, [token]);

  return (
    <div>
      <h2>Invoices</h2>
      {invoices.map((invoice) => (
        <p key={invoice.id.toString()}>{invoice.number}</p>
      ))}
    </div>
  );
};

export default Invoices;

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Invoice {
  id: Number
  number: String
}

interface InvoicesProps {
  token: string | null
}

const Invoices: React.FC<InvoicesProps> = ({token}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  console.log("Invoices got token", token)
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

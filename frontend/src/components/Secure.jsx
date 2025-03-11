import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Calendar from "./Calendar";
import Invoices from "./Invoices";

export default function Secure() {
  const googeAccessToken = Cookies.get("google_access_token");
  const fakturoidAccessToken = Cookies.get("fakturoid_access_token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!googeAccessToken || !fakturoidAccessToken) {
      navigate("/");
    }

  }, [navigate, googeAccessToken, fakturoidAccessToken]);

  return (
    <>
    <div className="row">
      <div className="col">
        <Calendar token={googeAccessToken} />
      </div>
      <div className="col"> 
        <Invoices token={fakturoidAccessToken} />
      </div>
    </div>
    </>
  );
}
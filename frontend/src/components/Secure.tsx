import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Calendar from "./Calendar";
import Invoices from "./Invoices";

export default function Secure() {
  const googleAccessToken = Cookies.get("google_access_token");
  const fakturoidAccessToken = Cookies.get("fakturoid_access_token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!googleAccessToken || !fakturoidAccessToken) {
      navigate("/");
      return
    }

  }, [navigate, googleAccessToken, fakturoidAccessToken]);

  return (
    <>
    <div className="row">
      <div className="col">
        <Calendar token={googleAccessToken!} />
      </div>
      <div className="col"> 
        <Invoices accessToken={fakturoidAccessToken!} />
      </div>
    </div>
    </>
  );
}
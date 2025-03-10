import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Calendar from "./Calendar";
import Invoices from "./Invoices";

export default function Secure() {
  const googeAccessToken = Cookies.get("google_access_token");
  const fakturoidAccessToken = Cookies.get("fakturoid_access_token");

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});

  const getUserDetails = async (accessToken) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
    );
    const data = await response.json();
    setUserDetails(data);
  };

  useEffect(() => {
    if (!googeAccessToken || !fakturoidAccessToken) {
      navigate("/");
    }

    getUserDetails(googeAccessToken);
  }, [navigate, googeAccessToken, fakturoidAccessToken]);

  return (
    <>
      <Calendar token={googeAccessToken} />
      <Invoices token={fakturoidAccessToken} />
    </>
  );
}
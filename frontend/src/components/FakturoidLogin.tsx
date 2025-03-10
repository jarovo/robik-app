import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Buffer } from "buffer";

export default function FakturoidLogin() {
  const fakuroidClientId = process.env.REACT_APP_FAKTUROID_CLIENT_ID
  console.log("Using client id for fakturoid", fakuroidClientId)
  if (!fakuroidClientId) throw Error("Missing env variable.")

  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  const handleClick = () => {
    const callbackUrl = `${window.location.origin}`;
    const targetUrl = `https://app.fakturoid.cz/api/v3/oauth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${fakuroidClientId}`;
    window.location.href = targetUrl;
  };

  const getToken = (code: string) => {
    const tokenUrl = `http://localhost:5000/auth/token`
    const creds = Buffer.from(`${process.env.REACT_APP_FAKTUROID_CLIENT_ID}:${process.env.REACT_APP_FAKTUROID_CLIENT_SECRET}`, 'utf-8').toString('base64');
    const config = { headers: {
      "user-agent": "robik-app",
      "content-type": "application/json",
      "accept": "application/json",
      "authorization": `Basic ${creds}`
    }}
    const data = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: window.location.origin
    }
    axios.post(tokenUrl, data, config).then((res) => {
      const { access_token, refresh_token, expires_in } = res.data
      console.log("Obtained fakturoid token", access_token, "refresh token", refresh_token, "expiring in", expires_in)
      Cookies.set('fakturoid_access_token', access_token, { expires: expires_in })
      setIsLoggedin(true)
    }).catch((err) => {
      console.error("Failed to obtain fakturoid token", err)
    })
  }

  useEffect(() => {
    const codeTokenRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(codeTokenRegex);

    if (isMatch) {
      const code = isMatch[1];
      console.log("Found code", code)
      getToken(code);
    }
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/secure");
    }
  }, [isLoggedin, navigate]);

  return (
    <div className="root">
      <div>
        <div className="btn-container">
          <button className="btn btn-primary" onClick={handleClick}>
            Log in with Fakturoid
          </button>
        </div>
      </div>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Buffer } from "buffer";

const fakturoidClientId = process.env.REACT_APP_FAKTUROID_CLIENT_ID
console.log("Using client id for fakturoid", fakturoidClientId)
if (!fakturoidClientId) throw Error("Missing env variable.")

export const redirectionUri = () => {
  return `${window.location.origin}/login/fakturoid`
}

export const onFakturoidLoginButtonClick = () => {
  const callbackUrl = redirectionUri();
  const targetUrl = `https://app.fakturoid.cz/api/v3/oauth?redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&client_id=${fakturoidClientId}`;
  window.location.href = targetUrl;
};

export default function FakturoidLogin() {

  const navigate = useNavigate();

  useEffect(() => {
    const getToken = (code: string) => {
      const tokenUrl = `/api/v3/oauth/token`
      const clientId = process.env.REACT_APP_FAKTUROID_CLIENT_ID
      const clientSecret = process.env.REACT_APP_FAKTUROID_CLIENT_SECRET
      console.log("Using client id and secret", clientId, clientSecret)
      const creds = Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64');
      const config = { headers: {
        "User-Agent": "robik-app (1187265+jarovo@users.noreply.github.com)",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${creds}`
      }}
      const data = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectionUri()
      }
      axios.post(tokenUrl, data, config).then((res) => {
        const data = res.data
        const { access_token, refresh_token, expires_in } = data
        console.log("Obtained fakturoid auth response", data)
        Cookies.set('fakturoid_access_token', access_token, { expires: expires_in, secure: true })
      }).catch((err) => {
        console.error("Failed to obtain fakturoid token", err)
      })
    }
    const codeTokenRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(codeTokenRegex);

    if (isMatch) {
      const code = isMatch[1];
      console.log("Found code", code)
      getToken(code);
      navigate('/')
    }
  }, []);

  return <>Logging into Fakturoid</>
}
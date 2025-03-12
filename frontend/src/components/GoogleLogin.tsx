import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

const googleClientId = process.env.REACT_APP_GAPI_CLIENT_ID
console.log("Using client id for google", googleClientId)
if (!googleClientId) throw Error("Missing REACT_APP_GAPI_CLIENT_ID env variable.")

export const onGoogleLoginButtonClick = () => {
  const callbackUrl = redirectionUri();
  const scopes = "openid email profile https://www.googleapis.com/auth/calendar.readonly"
  const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
    callbackUrl
  )}&response_type=token&client_id=${googleClientId}&scope=${encodeURIComponent(scopes)}`;
  window.location.href = targetUrl;
};

const redirectionUri = () => {
  return `${window.location.origin}/login/google`
}

export default function GoogleLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessTokenRegex = /access_token=([^&]+)/;
    const isMatch = window.location.href.match(accessTokenRegex);

    if (isMatch) {
      const accessToken = isMatch[1];
      Cookies.set("google_access_token", accessToken, {secure: true});
      navigate('/')
    }
  }, []);
  return <>Logging into Google</>;
}
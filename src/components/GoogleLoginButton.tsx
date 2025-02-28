import React from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

interface LoginProps {
    onLoginSuccess: (token: string) => void;
    onLogout: () => void;
  }


const GoogleLoginButton: React.FC<LoginProps> = ({ onLoginSuccess, onLogout })=> {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
        console.log("Access Token:", tokenResponse.access_token)
        onLoginSuccess(tokenResponse.access_token);
    },
    onError: () => console.log("Login Failed"),
    scope: "https://www.googleapis.com/auth/calendar.readonly",
  });

  return (
    <div>
      <button onClick={() => login()}>Sign in with Google</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default GoogleLoginButton;

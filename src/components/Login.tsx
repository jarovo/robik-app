// Login.tsx
import React from 'react';
import { GoogleLogin, hasGrantedAllScopesGoogle, useGoogleLogin} from '@react-oauth/google';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const handleSuccess = (credentialResponse: any) => {

    const hasAccess = hasGrantedAllScopesGoogle(
      credentialResponse,
      "https://www.googleapis.com/auth/calendar.events.readonly"
    );
    console.log("Has access", hasAccess)

    // Send the credential to your backend for verification and to get user info
    onLoginSuccess(credentialResponse.credential);
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      <button></button>
    </div>
  );
};

export default Login;

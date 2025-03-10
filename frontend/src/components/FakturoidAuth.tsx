import React from "react";
import { useAuth } from "./useAuth";

const FakturoidAuth = () => {
  const { token } = useAuth();

  return (
    <div>
      {!token ? (
        <a href="http://robik.net:5000/auth/login">Login with Fakturoid</a>
      ) : (
        <p>Authenticated! Token: {token}</p>
      )}
    </div>
  );
};

export default FakturoidAuth;

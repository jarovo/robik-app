import { useEffect, useState } from "react";
import axios from "axios";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("fakturoid_token")
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !token) {
      axios
        .get(`http://robik.net:5000/auth/callback?code=${code}`)
        .then((res) => {
          console.log("Got token", res.data)
          setToken(res.data.access_token);
          localStorage.setItem("fakturoid_token", res.data.access_token);
          window.history.replaceState({}, document.title, "/"); // Clean URL
        })
        .catch((err) => console.error("Auth Error", err));
    }
  }, [token])
  return token;
};

export default useAuth;

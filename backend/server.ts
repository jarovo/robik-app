import express, { RequestHandler } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const CLIENT_ID = process.env.REACT_APP_FAKTUROID_CLIENT_ID!;
const CLIENT_SECRET = process.env.REACT_APP_FAKTUROID_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REACT_APP_FAKTUROID_REDIRECT_URI!;
const API_BASE_URL = "https://app.fakturoid.cz";
const FAKTUROID_API_V3_BASEURL = `${API_BASE_URL}/api/v3`
const ACCOUNT_NAME = "jaroslavhenner"; // Change this to your account name
const USER_AGENT = "robik-app (1187265+jarovo@users.noreply.github.com)"; // Required by Fakturoid API

const authPassTroughHandler = (resourceName: string) => {
  const requestHandler: RequestHandler = async (clientRequest, clientResponse) => {
    // Get Authorization header from frontend request
    const authHeader = clientRequest.headers.authorization;
    if (!authHeader) {
      console.log("Missing authorization header.")
      clientResponse.status(401).json({ error: "Missing Authorization header" });
      return
    }

    console.log("Req headers", clientRequest.headers)

    const url = `${FAKTUROID_API_V3_BASEURL}/accounts/${ACCOUNT_NAME}/${resourceName}.json`
    const config = {
      headers: {
        Authorization: authHeader,
        "User-Agent": USER_AGENT, // Required by Fakturoid
        "Accept": clientRequest.headers["accept"],
        "Content-Type": clientRequest.headers["content-type"]
      }
    }

    console.log(`Requesting ${url}`, config)
    try {
      const serverResponse = await axios.get(url, config);    
      clientResponse.json(serverResponse.data);
    } catch (error: any) {
      console.error("Error fetching invoices:", error.message, error);
      clientResponse.status(error.response?.status || 500).json({
        error: "Failed to fetch invoices",
        details: error.response?.data || error.message,
      });
    }
  }

  return requestHandler
};

// Proxy invoices request
app.get("/api/subjects.json", authPassTroughHandler("subjects"));
app.get("/api/invoices.json", authPassTroughHandler("invoices"));
app.post("/api/invoices.json", authPassTroughHandler("invoices"));

// Redirect user to Fakturoid OAuth page
app.get("/auth/login", (req, res) => {
  const authUrl = `${API_BASE_URL}/api/v3/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  res.redirect(authUrl);
});

// ✅ FIX: Use RequestHandler instead of manually typing (req, res)
const authHandler: RequestHandler = async (req, res) => {
  console.log("Got auth request:", req.body, req.headers)

  const code = `${req.body.code}`;
  const grant_type = `${req.body.grant_type}`
  const redirect_uri = `${req.body.redirect_uri}`

  if (!code) {
    res.status(400).json({ error: "Missing authorization code" });
    return;
  }

  try {
    const config = { headers: {
      "User-Agent": "robik-app (<1187265+jarovo@users.noreply.github.com>)",
      "Content-Type": req.headers["content-type"],
      "Accept": req.headers["accept"],
      "Authorization": req.headers["authorization"],
   } }

    console.log("Making request with headers", config)

    const tokenResponse = await axios.post(
      `${API_BASE_URL}/api/v3/oauth/token`,
      req.body,
      config
    );

    res.json(tokenResponse.data);
  } catch (error : any) {
    console.error("Token exchange error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
};

// ✅ Attach handler without explicit async arrow function (avoids TypeScript error)
app.post("/auth/token", authHandler);
 
// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

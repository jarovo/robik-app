import express, { RequestHandler } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const CLIENT_ID = process.env.FAKTUROID_CLIENT_ID!;
const CLIENT_SECRET = process.env.FAKTUROID_CLIENT_SECRET!;
const REDIRECT_URI = process.env.FAKTUROID_REDIRECT_URI!;
const API_BASE_URL = "https://app.fakturoid.cz";
const FAKTUROID_API_V3_BASEURL = `${API_BASE_URL}/api/v3`
const ACCOUNT_NAME = "jaroslavhenner"; // Change this to your account name
const USER_AGENT = "robik-app (1187265+jarovo@users.noreply.github.com)"; // Required by Fakturoid API

const authPasstroughHandler: RequestHandler = async (req, res) => {
  // Get Authorization header from frontend request
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Missing Authorization header" });
    return
  }

  console.log("Req headers", req.headers)

  const url = `${FAKTUROID_API_V3_BASEURL}/accounts/${ACCOUNT_NAME}/invoices.json`
  const config = {
    headers: {
      Authorization: authHeader,
      "User-Agent": USER_AGENT, // Required by Fakturoid
      "Accept": req.headers["accept"],
      "Content-Type": req.headers["Content-Type"]
    }
  }

  console.log(`Requesting ${url}`, config)
  try {
    const response = await axios.get(url, config);    
    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching invoices:", error.response?.data, error);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch invoices",
      details: error.response?.data || error.message,
    });
  }
};

// Proxy invoices request
app.get("/api/subjects.json", authPasstroughHandler);
app.get("/api/invoices.json", authPasstroughHandler);
app.post("/api/invoices.json", authPasstroughHandler);

// Redirect user to Fakturoid OAuth page
app.get("/auth/login", (req, res) => {
  const authUrl = `${API_BASE_URL}/api/v3/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  res.redirect(authUrl);
});

// ✅ FIX: Use RequestHandler instead of manually typing (req, res)
const authCallbackHandler: RequestHandler = async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).json({ error: "Missing authorization code" });
    return;
  }

  try {
      
    // Create the Authorization header value for Basic Auth
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const tokenResponse = await axios.post(
      `${API_BASE_URL}/api/v3/oauth/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code,
      }),
      { headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "Authorization": `Basic ${basicAuth}`,
     } }
    );

    res.json(tokenResponse.data);
  } catch (error : any) {
    console.error("Token exchange error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
};

// ✅ Attach handler without explicit async arrow function (avoids TypeScript error)
app.get("/auth/callback", authCallbackHandler);
 
// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

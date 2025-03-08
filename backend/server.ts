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
  } catch (error) {
    console.error("Token exchange error:", error);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
};

// ✅ Attach handler without explicit async arrow function (avoids TypeScript error)
app.get("/auth/callback", authCallbackHandler);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

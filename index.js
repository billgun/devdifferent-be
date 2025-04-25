// server.js
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"; // import your router
import markersRoutes from "./routes/markers.js"; // import your router

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ✅ Allow requests from your frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // your Next.js origin
    credentials: true, // optional: allow cookies if needed
  })
);

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mount the auth router at /auth
app.use("/auth", authRoutes(supabase));
app.use("/api/markers", markersRoutes(supabase));

export default createServerlessExpressMiddleware({ app });

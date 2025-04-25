// api/server.js
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { createServerlessExpressMiddleware } from "@vendia/serverless-express";

import authRoutes from "../routes/auth.js";
import markersRoutes from "../routes/markers.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use("/auth", authRoutes(supabase));
app.use("/api/markers", markersRoutes(supabase));

// 👇 Wrap and export for Vercel
export default createServerlessExpressMiddleware({ app });

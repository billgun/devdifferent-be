// api/server.js
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import markersRoutes from "./routes/markers.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

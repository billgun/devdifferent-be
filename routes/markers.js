import express from "express";
import createAuthMiddleware from "../middleware/auth.js"; // Import your auth middleware

export default function markersRoutes(supabase) {
  const router = express.Router();
  const authMiddleware = createAuthMiddleware(supabase);

  router.use(authMiddleware); // All routes below this are protected

  // Save a new marker
  router.post("/", async (req, res) => {
    const { access_token, lat, lng, price, image_url } = req.body;

    if (!access_token || !lat || !lng || !price || !image_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(
      access_token
    );

    if (userError || !userData?.user?.id) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user_id = userData.user.id;

    const { data, error } = await supabase
      .from("user_markers")
      .insert([{ user_id, lat, lng, price, image_url }])
      .single();

    if (error) {
      return res.status(500).json({ error: "Failed to save marker" });
    }

    res.status(201).json(data);
  });

  // ✅ Get all markers for the logged-in user
  router.get("/", async (req, res) => {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: "No access token" });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { data, error } = await supabase
      .from("user_markers")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  });

  return router;
}

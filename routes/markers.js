import express from "express";
import createAuthMiddleware from "../middleware/auth.js"; // Import your auth middleware

export default function markersRoutes(supabase) {
  const router = express.Router();
  const authMiddleware = createAuthMiddleware(supabase);

  router.use(authMiddleware); // All routes below this are protected

  // Save a new marker
  router.post("/", async (req, res) => {
    const { lat, lng, price, image_url } = req.body;

    if (!lat || !lng || !price || !image_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user_id = req.user.id; // Access user from the middleware

    console.log(user_id);

    // Insert new marker into the database
    const { data, error } = await supabase
      .from("user_markers")
      .insert([{ user_id, lat, lng, price, image_url }])
      .single()
      .select("*"); // Select all columns

    if (error) {
      return res.status(500).json({ error: "Failed to save marker" });
    }

    res.status(201).json(data);
  });

  // Get all markers for the logged-in user (READ)
  router.get("/", async (req, res) => {
    const user_id = req.user.id; // Access user from the middleware

    const { data, error } = await supabase
      .from("user_markers")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  });

  // Get a specific marker by ID (READ)
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id; // Access user from the middleware

    // Fetch specific marker for logged-in user
    const { data, error } = await supabase
      .from("user_markers")
      .select("*")
      .eq("user_id", user_id)
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Marker not found" });
    }

    res.json(data);
  });

  // Update a specific marker (UPDATE)
  router.put("/:id", async (req, res) => {
    const { id } = req.params; // Extract the marker ID from the request parameters
    const { lat, lng, price, image_url } = req.body; // Extract the updated marker fields

    // Validate required fields
    if (!price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user_id = req.user.id; // Access user information from the middleware

    // Update the marker in the database for the logged-in user
    const { data, error } = await supabase
      .from("user_markers")
      .update({ price })
      .eq("user_id", user_id) // Ensure the user is updating their own marker
      .eq("id", id) // Ensure the marker ID matches
      .single(); // Fetch a single updated row

    if (error) {
      console.error("Error updating marker:", error);
      return res.status(500).json({ error: "Failed to update marker" });
    }

    // Return the updated marker data
    res.json(data);
  });

  // Delete a specific marker (DELETE)
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id; // Access user from the middleware

    // Delete marker for logged-in user
    const { data, error } = await supabase
      .from("user_markers")
      .delete()
      .eq("user_id", user_id)
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Failed to delete marker" });
    }

    res.json({ message: "Marker deleted successfully" });
  });

  return router;
}

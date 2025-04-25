import express from "express";

export default function authRoutes(supabase) {
  const router = express.Router();

  // Magic Link sender
  router.post("/magic-link", async (req, res) => {
    const { email } = req.body;

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.BACKEND_URL, // frontend redirect after success
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Magic link sent to your email" });
  });

  // Token verification
  router.post("/verify", async (req, res) => {
    const { access_token } = req.body;

    const { data, error } = await supabase.auth.getUser(access_token);

    if (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Set the user session, typically using a session cookie or JWT
    // Here we'll send the user data as a response
    res.json({ user: data.user });
  });

  // Check if the user is logged in
  router.get("/user", async (req, res) => {
    const { user, error } = await supabase.auth.getUser();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ user });
  });

  // Log out user (end session)
  router.post("/logout", async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Logged out successfully" });
  });

  return router;
}

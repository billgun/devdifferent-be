export default function createAuthMiddleware(supabase) {
  return async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user to request object
    req.user = data.user;
    next();
  };
}

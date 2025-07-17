export default function isTenant(req, res, next) {
  if (req.userRole !== "tenant") {
    return res.status(403).send("Access denied. Tenants only.");
  }
  next();
}
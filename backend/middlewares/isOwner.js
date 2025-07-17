export default function isOwner(req, res, next) {
  if (req.userRole !== "owner") {
    return res.status(403).send("Access denied. Owners only.");
  }
  next();
}
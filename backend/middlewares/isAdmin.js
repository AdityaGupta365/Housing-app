export default function isAdmin(req, res, next) {
  console.log('Checking admin role:', req.userRole);

  if (req.userRole !== "admin") {

    return res.status(403).send("Access denied. Admins only.");
  }
  next();
}

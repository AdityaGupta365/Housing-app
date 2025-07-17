// middlewares/adminOrOwner.middleware.js
import { getDB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

export default async function adminOrOwner(req, res, next) {
  const userId = req.userId;
  const userRole = req.userRole;
  const bookingId = req.params.id;

  // Allow if admin
  if (userRole === "admin") {
    return next();
  }

  try {
    const db = getDB();

    // Fetch booking
    const booking = await db
      .collection("bookings")
      .findOne({ _id: new ObjectId(bookingId) });

    if (!booking) return res.status(404).send("Booking not found");

    // Fetch property linked to booking
    const property = await db
      .collection("properties")
      .findOne({ _id: new ObjectId(booking.propertyId) });

    if (!property) return res.status(404).send("Property not found");

    // Allow if the user is the owner of the property
    if (property.ownerId === userId) {
      return next();
    }

    return res.status(403).send("Access denied. Admins or property owners only.");
  } catch (err) {
    console.error("Access check error:", err);
    return res.status(500).send("Internal server error");
  }
}

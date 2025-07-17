// import express from "express";
// import BookingController from "./bookings.controller.js";
// import jwtAuth from "../../middlewares/jwt.middleware.js";
// import adminOrOwner from "../../middlewares/adminOrOwner.middleware.js";
// import isTenant from "../../middlewares/isTenant.js";
// import isOwner from "../../middlewares/isOwner.js";



// const bookingRouter = express.Router();
// const BC = new BookingController();

// bookingRouter.post("/book", jwtAuth,isTenant, (req, res) => BC.createBooking(req, res));

// bookingRouter.put("/:id/approve", jwtAuth, adminOrOwner, (req, res) => BC.approveBooking(req, res));
// bookingRouter.put("/:id/deny", jwtAuth, adminOrOwner, (req, res) => BC.denyBooking(req, res));
// bookingRouter.get("/tenant", jwtAuth,isTenant, (req, res) => BC.getBookingsByTenant(req, res));


// // Get bookings for a property owner
// bookingRouter.get("/owner", jwtAuth,isOwner, (req, res) => BC.getBookingsByOwner(req, res));
// export default bookingRouter;



import express from "express";
import BookingController from "./bookings.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";
import adminOrOwner from "../../middlewares/adminOrOwner.middleware.js";
import isTenant from "../../middlewares/isTenant.js";
import isOwner from "../../middlewares/isOwner.js";
import isAdmin from "../../middlewares/isAdmin.js"; // Assuming you have this middleware

const bookingRouter = express.Router();
const BC = new BookingController();

// Create booking (tenant only)
bookingRouter.post("/", jwtAuth, isTenant, (req, res) => BC.createBooking(req, res));

// Approve booking (admin or owner)
bookingRouter.put("/:id/approve", jwtAuth, adminOrOwner, (req, res) => BC.approveBooking(req, res));

// Reject booking (admin or owner) - Changed from 'deny' to 'reject' to match frontend
bookingRouter.put("/:id/reject", jwtAuth, adminOrOwner, (req, res) => BC.rejectBooking(req, res));

// Get bookings for tenant
bookingRouter.get("/tenant", jwtAuth, isTenant, (req, res) => BC.getBookingsByTenant(req, res));

// Get bookings for owner
bookingRouter.get("/owner", jwtAuth, isOwner, (req, res) => BC.getBookingsByOwner(req, res));

export default bookingRouter;
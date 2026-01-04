// // import { BookingRepository } from "./bookings.repository.js";

// // const BR = new BookingRepository();
// // export default class BookingController{
// //     async createBooking(req,res){
// //         try{
// //             const tenantId=req.userId;
// //             const{propertyId,startDate,endDate}=req.body;
// //             const booking=await BR.createBooking(propertyId,tenantId,startDate,endDate);
// //             res.status(201).json(booking);
// //         }catch (err) {
// //             console.log(err);
// //             res.status(500).send("Error creating booking");
// //        }
// //     }
// // }



// import { ObjectId } from "mongodb";
// import { getDB } from "../../config/mongodb.js";
// import { sendEmail } from "../../utils/emailService.js";
// import { BookingRepository } from "./bookings.repository.js";

// const BR = new BookingRepository();

// export default class BookingController {
//   async createBooking(req, res) {
//     try {
//       const { propertyId, startDate, endDate } = req.body;
//       const tenantId = req.userId;

//       const db = getDB();

//       // 1. Fetch property
//       const property = await db
//         .collection("properties")
//         .findOne({ _id: new ObjectId(propertyId) });
//       if (!property) return res.status(404).send("Property not found");

//       // 2. Get property owner's email
//       const owner = await db
//         .collection("users")
//         .findOne({ _id: new ObjectId(property.ownerId) });
//       if (!owner || !owner.email)
//         return res.status(404).send("Owner not found");

//       // 3. Auto-reject overlapping bookings
//       const hasOverlap = await BR.checkOverlap(propertyId, startDate, endDate);
//       if (hasOverlap)
//         return res.status(409).send("Booking dates overlap with an existing booking");

//       // 4. Create booking (default status: pending)
//       const bookingId = await BR.createBooking(
//         tenantId,
//         propertyId,
//         startDate,
//         endDate,
//         "pending"
//       );

//       // 5. Send email notifications to owner and admin
//       const message = `New booking request from tenant ${tenantId} for property "${property.title}" from ${startDate} to ${endDate}.`;

//       await sendEmail(owner.email, "New Booking Request", message);
//     //   await sendEmail("admin@example.com", "Booking Notification", message);

//       res.status(201).send("Booking request submitted.");
//     } catch (err) {
//       console.error("Booking Error:", err);
//       res.status(500).send("Failed to create booking");
//     }
//   }
//     async approveBooking(req, res) {
//     try {
//       const { id } = req.params;
//       await BR.updateBookingStatus(id, "approved");
//       res.send("Booking approved");
//     } catch (err) {
//       res.status(500).send("Failed to approve booking");
//     }
//   }

//   async denyBooking(req, res) {
//     try {
//       const { id } = req.params;
//       await BR.updateBookingStatus(id, "denied");
//       res.send("Booking denied");
//     } catch (err) {
//       res.status(500).send("Failed to deny booking");
//     }
//   }
//   async getBookingsByTenant(req,res){
//     try{
//       const tenantId=req.userId;
//       const bookings=await BR.getBookingsByTenant(tenantId);
//       res.status(200).json(bookings);
//     }
//     catch(err){
//       res.status(500).send("Error fetching bookings");
//     }
//   }
//   async getBookingsByOwner(req, res) {
//     try {
//       const ownerId = req.userId;
//       const bookings = await BR.getBookingsByOwner(ownerId);
//       res.status(200).json(bookings);
//     } catch (err) {
//       res.status(500).send("Error fetching bookings");
//     }
//   }

// }





// bookings.controller.js
import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { sendEmail } from "../../utils/emailService.js";
import { BookingRepository } from "./bookings.repository.js";
import { RentalHistoryRepository } from "../rentalHistory/rentalHistory.repository.js";

const BR = new BookingRepository();
const RHR = new RentalHistoryRepository();

export default class BookingController {
  // async createBooking(req, res) {
  //   try {
  //     const { propertyId, startDate, endDate } = req.body;
  //     console.log(req.body);
  //     const tenantId = req.userId;

  //     const db = getDB();

  //     const property = await db.collection("properties").findOne({ _id: new ObjectId(propertyId) });
  //     if (!property) return res.status(404).send("Property not found");

  //     const owner = await db.collection("users").findOne({ _id: new ObjectId(property.ownerId) });
  //     if (!owner?.email) return res.status(404).send("Owner not found");

  //     const hasOverlap = await BR.checkOverlap(propertyId, startDate, endDate);
  //     if (hasOverlap) return res.status(409).send("Booking overlaps with existing one");

  //     const booking = await BR.createBooking(tenantId, propertyId, startDate, endDate, "pending");

  //     const message = `Booking request by tenant ${tenantId} for property "${property.title}" from ${startDate} to ${endDate}`;
  //     await sendEmail(owner.email, "New Booking Request", message);

  //     res.status(201).send("Booking request submitted.");
  //   } catch (err) {
  //     console.error("Booking Error:", err);
  //     res.status(500).send("Failed to create booking");
  //   }
  // }
  
  async createBooking(req, res) {
    try {
      const { propertyId, startDate, endDate } = req.body;
      const tenantId = req.userId;

      const db = getDB();

      // ... existing property & owner validation checks ...
      const property = await db.collection("properties").findOne({ _id: new ObjectId(propertyId) });
      if (!property) return res.status(404).send("Property not found");

      const owner = await db.collection("users").findOne({ _id: new ObjectId(property.ownerId) });
      if (!owner?.email) return res.status(404).send("Owner not found");

      const hasOverlap = await BR.checkOverlap(propertyId, startDate, endDate);
      if (hasOverlap) return res.status(409).send("Booking overlaps with existing one");

      // ✅ FIX 1: Correct Argument Order (propertyId first, then tenantId)
      // Note: "pending" is not in your repo definition, so make sure your BookingModel handles status default
      const booking = await BR.createBooking(propertyId, tenantId, startDate, endDate);

      const message = `Booking request by tenant ${tenantId} for property "${property.title}" from ${startDate} to ${endDate}`;
      await sendEmail(owner.email, "New Booking Request", message);

      // ✅ FIX 2: Return the actual booking object (JSON), NOT a string
      res.status(201).json(booking); 

    } catch (err) {
      console.error("Booking Error:", err);
      res.status(500).send("Failed to create booking");
    }
  }
  
  async approveBooking(req, res) {
    try {
      const { id } = req.params;

      await BR.updateBookingStatus(id, "approved");

      // Add rental history record
      const booking = await BR.getBookingById(id);
      if (!booking) return res.status(404).send("Booking not found");

      await RHR.addRentalHistory(
        booking.tenantId,
        booking.propertyId,
        booking.startDate,
        booking.endDate
      );

      // res.send("Booking approved and rental history created.");
      res.json(booking);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to approve booking");
    }
  }

  async denyBooking(req, res) {
    try {
      const { id } = req.params;
      await BR.updateBookingStatus(id, "denied");
      // res.send("Booking denied");
      res.json(booking);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to deny booking");
    }
  }

  async getBookingsByTenant(req, res) {
    try {
      const tenantId = req.userId;
      const bookings = await BR.getBookingsByTenant(tenantId);
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching bookings");
    }
  }

  async getBookingsByOwner(req, res) {
    try {
      const ownerId = req.userId;
      const bookings = await BR.getBookingsByOwner(ownerId);
      res.status(200).json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching bookings");
    }
  }
}

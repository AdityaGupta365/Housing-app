


    

import BookingModel from "./bookings.model.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export class BookingRepository {
  constructor() {
    this.collection = "bookings";
  }

 
  async createBooking(propertyId, tenantId, startDate, endDate, status = "pending") {
    const db = getDB();
    

    const booking = {
        propertyId: new ObjectId(propertyId),
        tenantId: new ObjectId(tenantId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status,
        createdAt: new Date()
    };

    try {
      await db.collection(this.collection).insertOne(booking);
      return booking;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async checkOverlap(propertyId, startDate, endDate) {
    const db = getDB();
    return await db.collection("bookings").findOne({
      propertyId: new ObjectId(propertyId),
      status: { $in: ["pending", "approved"] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });
  }

  async updateBookingStatus(bookingId, status) {
    const db = getDB();
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status } }
    );
  }


  async getBookingsByTenant(tenantId) {
    const db = getDB();

    return await db.collection("bookings").aggregate([
      {
        // 1. Find bookings for this tenant
        $match: { tenantId: new ObjectId(tenantId) }
      },
      {
        
        $lookup: {
          from: "properties",      // Collection name in DB
          localField: "propertyId", // Field in 'bookings'
          foreignField: "_id",      // Field in 'properties'
          as: "property"            // Output field name
        }
      },
      {
   
        $unwind: {
             path: "$property",
             preserveNullAndEmptyArrays: true 
        }
      },
      {
        
        $sort: { createdAt: -1 }
      }
    ]).toArray();
  }
  
  async getBookingById(bookingId) {
    const db = getDB();
    try {
      return await db.collection(this.collection).findOne({ _id: new ObjectId(bookingId) });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getBookingsByOwner(ownerId) {
    const db = getDB();

 
    const properties = await db
      .collection("properties")
      .find({ ownerId:ownerId })
      .project({ _id: 1 })
      .toArray();

    const propertyIds = properties.map((p) => p._id);

    // 2. Fetch bookings and join with Property details + Tenant details
    return await db.collection("bookings").aggregate([
        {
            $match: { propertyId: { $in: propertyIds } }
        },
        {
            $lookup: {
                from: "properties",
                localField: "propertyId",
                foreignField: "_id",
                as: "property"
            }
        },
        { $unwind: "$property" },
        {
            // Optional: Get Tenant details (name/email) for the Owner to see
            $lookup: {
                from: "users",
                localField: "tenantId",
                foreignField: "_id",
                as: "tenant"
            }
        },
        { $unwind: { path: "$tenant", preserveNullAndEmptyArrays: true } },
        { 
             // Project only necessary fields to protect user privacy
             $project: {
                 startDate: 1,
                 endDate: 1,
                 status: 1,
                 createdAt: 1,
                 property: 1,
                 "tenant.name": 1,
                 "tenant.email": 1
             }
        }
    ]).toArray();
  }

}
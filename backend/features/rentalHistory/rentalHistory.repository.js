// rentalHistory.repository.js
// import { getDB } from "../../config/mongodb.js";
// import RentalHistoryModel from "./rentalHistory.model.js";
// import { ObjectId } from "mongodb";

// export class RentalHistoryRepository {
//   constructor() {
//     this.collection = "rentalHistory";
//   }

//   async addRentalHistory(tenantId, propertyId, startDate, endDate) {
//     const db = getDB();
//     const rental = new RentalHistoryModel(tenantId, propertyId, startDate, endDate);
//     await db.collection(this.collection).insertOne(rental);
//     return rental;
//   }

//   // async getHistoryByTenant(tenantId) {
//   //   const db = getDB();
//   //   return await db.collection(this.collection)
//   //     .find({ tenantId: new ObjectId(tenantId) })
//   //     .toArray();
//   // }
//   // Replace the old getHistoryByTenant with this:
//   async getHistoryByTenant(tenantId) {
//     const db = getDB();
//     return await db.collection(this.collection).aggregate([
//       // 1. Find rentals for this tenant
//       { $match: { tenantId: new ObjectId(tenantId) } },
      
//       // 2. Join with the 'properties' collection to get details (title, rent, etc.)
//       {
//         $lookup: {
//           from: "properties", 
//           localField: "propertyId", 
//           foreignField: "_id",
//           as: "property"
//         }
//       },
      
//       // 3. Unwind the property array (convert [obj] to obj)
//       { $unwind: "$property" },
      
//       // 4. Sort by newest first
//       { $sort: { startDate: -1 } }
//     ]).toArray();
//   }

//   async markAsPaid(id) {
//     const db = getDB();
//     return await db.collection(this.collection).updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { paymentStatus: "paid" } }
//     );
//   }
// }



import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";

export class RentalHistoryRepository {
  constructor() {
    this.collection = "rentalHistory";
  }

  // ✅ FIX 1: Force conversion to ObjectId when saving
  // This ensures the data types match the 'properties' collection _id
  async addRentalHistory(tenantId, propertyId, startDate, endDate) {
    const db = getDB();
    
    // Validate IDs before conversion to prevent crashes
    if (!ObjectId.isValid(tenantId) || !ObjectId.isValid(propertyId)) {
        throw new Error("Invalid Tenant ID or Property ID");
    }

    return await db.collection(this.collection).insertOne({
      tenantId: new ObjectId(tenantId),   // Convert String -> ObjectId
      propertyId: new ObjectId(propertyId), // Convert String -> ObjectId
      startDate: new Date(startDate),      // Ensure Date object for proper sorting
      endDate: new Date(endDate),
      status: "active",
      paymentStatus: "pending",
      createdAt: new Date()
    });
  }

  // ✅ FIX 2: Use Aggregation with Lookup to join Property details
  async getHistoryByTenant(tenantId) {
    const db = getDB();
    
    return await db.collection(this.collection).aggregate([
      // 1. Match rentals for this tenant (Convert string input to ObjectId)
      { $match: { tenantId: new ObjectId(tenantId) } },
      
      // 2. Join with 'properties' collection
      {
        $lookup: {
          from: "properties",
          localField: "propertyId", // This is now an ObjectId (thanks to addRentalHistory)
          foreignField: "_id",      // This is always an ObjectId
          as: "property"
        }
      },
      
      // 3. Unwind to turn the array [property] into an object {property}
      { $unwind: "$property" },
      
      // 4. Sort by newest Start Date
      { $sort: { startDate: -1 } }
    ]).toArray();
  }

  // (Optional) Helper for owners if needed later
  async getHistoryByProperty(propertyId) {
    const db = getDB();
    return await db.collection(this.collection).find({ 
        propertyId: new ObjectId(propertyId) 
    }).toArray();
  }
}

import BookingModel from "./bookings.model.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
export class BookingRepository{
    constructor(){
        this.collection="bookings";
    }
    async createBooking(propertyId,tenantId,startDate,endDate){
        const booking = new BookingModel(propertyId, tenantId, startDate, endDate);
        const db = getDB();
        await db.collection(this.collection).insertOne(booking);
        return booking;
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
  async updateBookingStatus(bookingId,status){
    const db=getDB();

    await db.collection("bookings").updateOne(
        {_id:new ObjectId(bookingId)},
        {$set:{status}}
    );
  }
  async getBookingsByTenant(tenantId) {
    const db = getDB();

    return await db
      .collection("bookings")
      .find({ tenantId: new ObjectId(tenantId) })
      .toArray();
  }
   async getBookingsByOwner(ownerId) {
    const db = getDB();

    const properties = await db
      .collection("properties")
      .find({ ownerId: new ObjectId(ownerId) })
      .project({ _id: 1 })
      .toArray();

    const propertyIds = properties.map((p) => p._id);

    return await db
      .collection("bookings")
      .find({ propertyId: { $in: propertyIds } })
      .toArray();
  }
}


    
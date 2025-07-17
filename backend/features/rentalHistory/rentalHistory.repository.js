// rentalHistory.repository.js
import { getDB } from "../../config/mongodb.js";
import RentalHistoryModel from "./rentalHistory.model.js";
import { ObjectId } from "mongodb";

export class RentalHistoryRepository {
  constructor() {
    this.collection = "rentalHistory";
  }

  async addRentalHistory(tenantId, propertyId, startDate, endDate) {
    const db = getDB();
    const rental = new RentalHistoryModel(tenantId, propertyId, startDate, endDate);
    await db.collection(this.collection).insertOne(rental);
    return rental;
  }

  async getHistoryByTenant(tenantId) {
    const db = getDB();
    return await db.collection(this.collection)
      .find({ tenantId: new ObjectId(tenantId) })
      .toArray();
  }

  async markAsPaid(id) {
    const db = getDB();
    return await db.collection(this.collection).updateOne(
      { _id: new ObjectId(id) },
      { $set: { paymentStatus: "paid" } }
    );
  }
}

import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export class AdminRepository {
  async getAllUsers() {
    const db = getDB();
    return await db.collection("users").find({}).toArray();
  }

  async deleteUserById(userId) {
    const db = getDB();
    return await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
  }

  async getAllProperties() {
    const db = getDB();
    return await db.collection("properties").find({}).toArray();
  }

  async deletePropertyById(propertyId) {
    const db = getDB();
    return await db.collection("properties").deleteOne({ _id: new ObjectId(propertyId) });
  }

  async getAllBookings() {
    const db = getDB();
    return await db.collection("bookings").find({}).toArray();
  }
}

import { getDB } from "../../config/mongodb.js";
import UserModel from "./user.model.js";
import bcrypt from "bcryptjs";

export default class UserRepository {
  constructor() {
    this.collection = "users";
  }

  async signUp(name, email, role,password) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      // Check if email already exists
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(String(password), 10);

      // Create user object
      const user = new UserModel(name, email, role,hashedPassword);

      // Insert into database
      await collection.insertOne(user);

      return user;
    } catch (err) {
      console.error("SignUp Error:", err.message);
      throw err;
    }
  }

  async signIn(email, password) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      // Find user by email
      const user = await collection.findOne({ email });
      if (!user) {
        return null; // Email not found
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(String(password), String(user.password));
      if (!isPasswordValid) {
        return null; // Wrong password
      }

      return user;
    } catch (err) {
      console.error("SignIn Error:", err.message);
      throw err;
    }
  }
}

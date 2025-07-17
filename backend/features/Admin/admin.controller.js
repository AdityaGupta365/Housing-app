import { AdminRepository } from "./admin.repository.js";
const AR = new AdminRepository();

export default class AdminController {
  async getUsers(req, res) {
    try {
      const users = await AR.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).send("Failed to fetch users");
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await AR.deleteUserById(id);
      res.send("User deleted");
    } catch (err) {
      res.status(500).send("Failed to delete user");
    }
  }

  async getProperties(req, res) {
    try {
      const properties = await AR.getAllProperties();
      res.status(200).json(properties);
    } catch (err) {
      res.status(500).send("Failed to fetch properties");
    }
  }

  async deleteProperty(req, res) {
    try {
      const { id } = req.params;
      await AR.deletePropertyById(id);
      res.send("Property deleted");
    } catch (err) {
      res.status(500).send("Failed to delete property");
    }
  }

  async getBookings(req, res) {
    try {
      const bookings = await AR.getAllBookings();
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).send("Failed to fetch bookings");
    }
  }
}

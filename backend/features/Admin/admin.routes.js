import express from "express";
import AdminController from "./admin.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";
import isAdmin from "../../middlewares/isAdmin.js";

const router = express.Router();
const AC = new AdminController();

router.use(jwtAuth, isAdmin);

router.get("/users", (req, res) => AC.getUsers(req, res));
router.delete("/users/:id", (req, res) => AC.deleteUser(req, res));

router.get("/properties", (req, res) => AC.getProperties(req, res));
router.delete("/properties/:id", (req, res) => AC.deleteProperty(req, res));

router.get("/bookings", (req, res) => AC.getBookings(req, res));

export default router;

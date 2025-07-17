// rentalHistory.routes.js
import express from "express";
import RentalHistoryController from "./rentalHistory.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";
import isTenant from "../../middlewares/isTenant.js";

const historyRouter = express.Router();
const RHC = new RentalHistoryController();

historyRouter.post("/", jwtAuth, isTenant, (req, res) => RHC.addHistory(req, res));
historyRouter.get("/", jwtAuth, isTenant, (req, res) => RHC.getTenantHistory(req, res));
historyRouter.put("/:id/pay", jwtAuth, isTenant, (req, res) => RHC.markPaid(req, res));

export default historyRouter;

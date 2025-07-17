// rentalHistory.controller.js
import { RentalHistoryRepository } from "./rentalHistory.repository.js";

const RHR = new RentalHistoryRepository();

export default class RentalHistoryController {
  async addHistory(req, res) {
    try {
      const tenantId = req.userId;
      const { propertyId, startDate, endDate } = req.body;
      const record = await RHR.addRentalHistory(tenantId, propertyId, startDate, endDate);
      res.status(201).json(record);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding rental history");
    }
  }

  async getTenantHistory(req, res) {
    try {
      const tenantId = req.userId;
      const history = await RHR.getHistoryByTenant(tenantId);
      res.status(200).json(history);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching rental history");
    }
  }

  async markPaid(req, res) {
    try {
      const { id } = req.params;
      await RHR.markAsPaid(id);
      res.send("Marked as paid");
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to update payment status");
    }
  }
}

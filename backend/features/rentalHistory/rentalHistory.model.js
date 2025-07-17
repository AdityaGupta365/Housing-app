// rentalHistory.model.js
export default class RentalHistory {
  constructor(tenantId, propertyId, startDate, endDate, paymentStatus = "unpaid", status = "active") {
    this.tenantId = tenantId;
    this.propertyId = propertyId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.paymentStatus = paymentStatus; // paid/unpaid
    this.status = status; // active/completed
    this.createdAt = new Date();
  }
}

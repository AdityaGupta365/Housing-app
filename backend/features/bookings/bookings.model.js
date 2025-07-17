export default class BookingModel{
    constructor(propertyId,tenantId,startDate,endDate,status="pending"){
        this.propertyId=propertyId;
        this.tenantId=tenantId;
        this.startDate=new Date(startDate);
        this.endDate=new Date(endDate);
        this.status=status;
        this.createdAt=new Date();
    }
}
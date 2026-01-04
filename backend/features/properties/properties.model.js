

export default class PropertyModel {
  constructor(
    title, description, rent, location, ownerId,
    imageUrls = [], isAvailable = true, bedrooms = 1,
    amenities = []
  ) {
    this.title = title;
    this.description = description;
    this.rent = rent;
    this.location = location;
    this.ownerId = ownerId;
    this.imageUrls = imageUrls;
    this.isAvailable = isAvailable;
    this.bedrooms = bedrooms;
    this.amenities = amenities;
    this.createdAt = new Date();
  }
}


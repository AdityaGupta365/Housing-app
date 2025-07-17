import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import PropertyModel from "./properties.model.js";

export class PropertyRepository {
  constructor() {
    this.collection = "properties";
  }

  async addProperty(title, description, rent, location, ownerId, imageUrls, isAvailable,bedrooms,amenities) {
    const property = new PropertyModel(title, description, rent, location, ownerId, imageUrls, isAvailable,bedrooms,amenities);
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      await collection.insertOne(property);
      return true;
    } catch (err) {
      console.error("Error inserting property:", err);
      throw err;
    }
  }
  async getAllProperties(){
      try{
        const db=getDB();
        const collection = db.collection(this.collection);
        return await collection.find({}).toArray();
      }
      catch(err){
        console.log(err);
      }
  }
  async getPropertiesByOwner(ownerId){
    try{
      const db= getDB();
      const collection =db.collection(this.collection);
      return await collection.find({ownerId}).toArray();
    }
    catch(err){
      throw err;
    }
  }
  async deleteProperty(propertyId) {
  try {
    const db = getDB();
    const collection = db.collection(this.collection);
    await collection.deleteOne({ _id: new ObjectId(propertyId) });
    return true;
  } catch (err) {
    throw err;
  }
} 
   async searchProperties(filters){
    try{
      const db=getDB();
      const collection = db.collection(this.collection);
      const query={};
      if(filters.location){
        query.location = { $regex: filters.location, $options: 'i' };
      }
      if(filters.rentMin||filters.rentMax){
        query.rent={};
        if(filters.rentMin){
          query.rent.$gte=parseInt(filters.rentMin);
        }
        if(filters.rentMax){
          query.rent.$lte=parseInt(filters.rentMax);
        }
      }
      return await collection.find(query).toArray();
    }catch(err){
      throw err;
    }
   }
   async updateProperty(propertyId,updateData){
    try{
      const db=getDB();
      const collection=db.collection(this.collection);
      await collection.updateOne(
        {
          _id:new ObjectId(propertyId)
        },{
          $set:updateData
        }
      );
      return true;
    }catch(err){
      throw err;
    }
   }

}

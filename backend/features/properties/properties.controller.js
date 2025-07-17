// import { getDB } from "../../config/mongodb.js";
// import { PropertyRepository } from "./properties.repository.js";

// const PR = new PropertyRepository();

// export default class PropertyController {
//   async addProperty(req, res) {
//     try {
//       const { title, description, rent, location, isAvailable } = req.body;
//       const ownerId = req.userId; // from jwtAuth middleware
//       const imageUrls = req.files?.map(file => file.path) || [];
//       const bedrooms=req.bedrooms

//       if (!title || !description || !rent || !location || !isAvailable) {
//         return res.status(400).send("Missing required fields");
//       }

//       const result = await PR.addProperty(
//         title,
//         description,
//         parseFloat(rent),
//         location,
//         ownerId,
//         imageUrls,
//         isAvailable === "true"
//       );

//       if (result) {
//         return res.status(201).send("Property added successfully.");
//       } else {
//         return res.status(500).send("Failed to add property.");
//       }
//     } catch (err) {
//       console.error("Add Property Error:", err.message);
//       return res.status(500).send("Internal Server Error");
//     }
//   }
//   async getAllProperties(req,res){
//     try{
//       const properties = await PR.getAllProperties();
//       res.status(200).json(properties);
//     }
//     catch(err){
//       res.status(500).send("Error fetching properties");
//     }
//   }
//   async getPropertiesByOwner(req, res) {
//   try {
//     const ownerId = req.userId; // from JWT middleware
//     const properties = await PR.getPropertiesByOwner(ownerId);
//     res.status(200).json(properties);
//   } catch (err) {
//     res.status(500).send("Error fetching owner properties");
//   }
// }
//   async deleteProperty(req,res){
//     try{
//       const{id}=req.params;
//       await PR.deleteProperty(id);
//       res.send("Property deleted");
//     }
//     catch(err){
//       console.log(err);
//       res.status(500).send("Error deleting Property");
//     }
//   }
//   async searchProperties(req, res) {
//     try {
//       const filters = req.query;
//       const results = await PR.searchProperties(filters);
//       res.status(200).json(results);
//     } catch (err) {
//         res.status(500).send("Search failed");
//     }
//   }

//   async updateProperty(req, res) {
//     try {
//       const { id } = req.params;         // from URL like /property/update/:id
//       const updateData = req.body;       // data from request body (JSON)
//       await PR.updateProperty(id, updateData);  // call repo function
//       res.send("Property updated");      // response to client
//     } catch (err) {
//         res.status(500).send("Error updating property");
//     }
//   }

// }



import { getDB } from "../../config/mongodb.js";
import { PropertyRepository } from "./properties.repository.js";

const PR = new PropertyRepository();

export default class PropertyController {
  async addProperty(req, res) {
    try {
      const {
        title,
        description,
        rent,
        location,
        isAvailable=true,
        bedrooms,
        amenities
      } = req.body;

      const ownerId = req.userId; // from jwtAuth middleware
      const imageUrls = req.files?.map(file => file.path) || [];

      // Validation
      if (
        !title ||
        !description ||
        !rent ||
        !location ||
        !bedrooms
      ) {
        return res.status(400).send("Missing required fields");
      }

      const parsedRent = parseFloat(rent);
      const parsedBedrooms = parseInt(bedrooms);
      const parsedAmenities = Array.isArray(amenities)
        ? amenities
        : typeof amenities === "string"
        ? amenities.split(",").map(a => a.trim())
        : [];

      const result = await PR.addProperty(
        title,
        description,
        parsedRent,
        location,
        ownerId,
        imageUrls,
        isAvailable === "true" || isAvailable === true,
        parsedBedrooms,
        parsedAmenities
      );

      if (result) {
        return res.status(201).send("Property added successfully.");
      } else {
        return res.status(500).send("Failed to add property.");
      }
    } catch (err) {
      console.error("Add Property Error:", err.message);
      return res.status(500).send("Internal Server Error");
    }
  }

  async getAllProperties(req, res) {
    try {
      const properties = await PR.getAllProperties();
      res.status(200).json(properties);
    } catch (err) {
      res.status(500).send("Error fetching properties");
    }
  }

  async getPropertiesByOwner(req, res) {
    try {
      const ownerId = req.userId;
      const properties = await PR.getPropertiesByOwner(ownerId);
      res.status(200).json(properties);
    } catch (err) {
      res.status(500).send("Error fetching owner properties");
    }
  }

  async deleteProperty(req, res) {
    try {
      const { id } = req.params;
      await PR.deleteProperty(id);
      res.send("Property deleted");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting property");
    }
  }

  async searchProperties(req, res) {
    try {
      const filters = req.query;
      const results = await PR.searchProperties(filters);
      res.status(200).json(results);
    } catch (err) {
      res.status(500).send("Search failed");
    }
  }

  async updateProperty(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      await PR.updateProperty(id, updateData);
      res.send("Property updated");
    } catch (err) {
      res.status(500).send("Error updating property");
    }
  }
}

import express from "express";
import PropertyController from "./properties.controller.js";
import { upload } from "../../middlewares/cloudinaryUpload.js"; // uses multer
import jwtAuth from "../../middlewares/jwt.middleware.js";

const PC = new PropertyController();
const propertyRouter = express.Router();

propertyRouter.post(
  '/addproperty',
  jwtAuth,
  upload.array("imageUrl", 5), // Accept up to 5 files from 'imageUrl' field
  (req, res, next) => {
    PC.addProperty(req, res, next);
  }
);
propertyRouter.get(
  '/properties',
  jwtAuth,

  (req, res, next) => {
    PC.getAllProperties(req, res, next);
  }
);
propertyRouter.get(
  '/owner',
  jwtAuth,

  (req, res, next) => {
    PC.getPropertiesByOwner(req, res, next);
  }
);
propertyRouter.delete(
  '/:id',
  jwtAuth,

  (req, res, next) => {
    PC.deleteProperty(req, res, next);
  }
);
propertyRouter.get(
  '/search',
  jwtAuth,

  (req, res, next) => {
    PC.searchProperties(req, res, next);
  }
);
propertyRouter.put(
  '/:id',
  jwtAuth,

  (req, res, next) => {
    PC.updateProperty(req, res, next);
  }
);

export default propertyRouter;

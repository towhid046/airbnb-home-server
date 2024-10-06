import express from "express";
import { filterProperty, getLocations, getProperties, updateProperty, filterPropertyCount } from "../handlers/propertyHandler";

const routes = express.Router();

routes.get("/properties", getProperties);
routes.get("/locations", getLocations);
routes.put("/update-property", updateProperty);
routes.get("/filter-properties-count", filterPropertyCount);
routes.get("/filter-properties", filterProperty);


export default routes;

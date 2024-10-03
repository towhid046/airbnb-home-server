import express from "express";
import { getLocations, getProperties } from "../handlers/propertyHandler";

const routes = express.Router();

routes.get("/properties", getProperties);
routes.get("/locations", getLocations);

export default routes;

import { Request, Response } from "express";
import { getDB } from "../config/db";
import { getPropertiesCollection } from "../collections/propertiesCollection";

export const getProperties = async (req: Request, res: Response) => {
  const db = getDB();
  const propertiesCollection = getPropertiesCollection(db);
  try {
    const properties = await propertiesCollection.find().toArray();
    res.send(properties);
  } catch (error) {
    res.send(error);
  }
};

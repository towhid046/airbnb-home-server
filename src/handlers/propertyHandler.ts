import { Request, Response } from "express";
import { getDB } from "../config/db";
import { getPropertiesCollection } from "../collections/propertiesCollection";

export const getProperties = async (req: Request, res: Response) => {
  const db = getDB();
  const propertiesCollection = getPropertiesCollection(db);
  const start = Number(req.query.startDate);
  const end = Number(req.query.endDate);
  try {
    let properties;
    if (start && end) {
      const query = {
        endDate: { $gte: end },
        startDate: { $lte: start },
      };
      properties = await propertiesCollection.find(query).toArray();
    } else {
      properties = await propertiesCollection.find().toArray();
    }
    res.send(properties);
  } catch (error) {
    res.send(error);
  }
};

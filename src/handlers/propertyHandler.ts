import { Request, Response } from "express";
import { getDB } from "../config/db";
import { getPropertiesCollection } from "../collections/propertiesCollection";

export const getProperties = async (req: Request, res: Response) => {
  const db = getDB();
  const propertiesCollection = await getPropertiesCollection(db);
  const start = Number(req.query.startDate);
  const end = Number(req.query.endDate);
  const { search, category } = req.query;
  try {
    let properties;

    if ((start && end) || search || category) {
      const query = search
        ? { location: { $regex: search, $options: "i" } }
        : category
        ? { category }
        : {
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

export const getLocations = async (req: Request, res: Response) => {
  const db = getDB();
  const propertiesCollection = await getPropertiesCollection(db);
  const { search } = req.query;

  try {
    const filter = search
      ? { location: { $regex: search, $options: "i" } }
      : {};

    const locations = await propertiesCollection
      .find(filter, {
        projection: { _id: 0, location: 1 },
      })
      .toArray();

    const locationArr = locations.map(
      (item: { location: string }) => item.location
    );

    res.send(locationArr);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to fetch locations", details: error });
  }
};

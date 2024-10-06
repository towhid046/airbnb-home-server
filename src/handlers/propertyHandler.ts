import { Request, Response } from "express";
import { getDB } from "../config/db";
import { getPropertiesCollection } from "../collections/propertiesCollection";
import { ObjectId } from "mongodb";

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

export const updateProperty = async (
  req: Request,
  res: Response
): Promise<any> => {
  const db = getDB();
  const propertiesCollection = await getPropertiesCollection(db);
  const property = req.body;
  const { id } = req.query;

  // Ensure id is a string
  if (typeof id !== "string" || !property) {
    return res
      .status(400)
      .send({ message: "Both id and property are required!" });
  }

  const query = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      ...property,
    },
  };

  try {
    const result = await propertiesCollection.updateOne(query, updatedDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const filterProperty = async (
  req: Request,
  res: Response
): Promise<any> => {
  const db = getDB();
  const propertiesCollection = await getPropertiesCollection(db);

  // Parse query parameters
  const minPrice = Number(req.query?.minPrice);
  const maxPrice = Number(req.query?.maxPrice);
  const { category } = req.query;
  let amenities = req?.query?.amenities;
  if (amenities) {
    amenities = amenities.toString().split(",");
  }

  let bookingOptions = req?.query?.bookingOptions;
  if (bookingOptions) {
    bookingOptions = bookingOptions.toString().split(",");
  }

  let hostLanguages = req?.query?.hostLanguages;
  if (hostLanguages) {
    hostLanguages = hostLanguages.toString().split(",");
  }

  // Ensure both minPrice and maxPrice are provided
  if (!minPrice || !maxPrice) {
    return res
      .status(400)
      .send({ message: "Both min price and max price are required!" });
  }

  try {
    // Base filter for price
    const filter: any = {
      price: { $gte: minPrice, $lte: maxPrice },
    };

    // Add category filter if provided
    if (category) {
      filter.category = category;
    }

    // Add amenities filter if provided
    if (amenities && amenities.length > 0) {
      filter.amenities = { $all: amenities };
    }

    // Add booking options filter if provided
    if (bookingOptions && bookingOptions.length > 0) {
      filter.bookingOptions = { $all: bookingOptions };
    }

    // Add host languages filter if provided
    if (hostLanguages && hostLanguages.length > 0) {
      filter.hostLanguages = { $all: hostLanguages };
    }

    // Fetch filtered properties from the database
    const properties = await propertiesCollection.find(filter).toArray();

    // Return the filtered properties
    res.send(properties);
  } catch (error) {
    console.error("Error filtering properties:", error);
    res
      .status(500)
      .send({ error: "An error occurred while filtering properties." });
  }
};

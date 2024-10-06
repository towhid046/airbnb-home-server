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

export const filterPropertyCount = async (
  req: Request,
  res: Response
): Promise<any> => {
  const db = getDB();
  const propertiesCollection = await getPropertiesCollection(db);

  const minPrice = Number(req.query?.minPrice);
  const maxPrice = Number(req.query?.maxPrice);
  const propertyType = req.query?.propertyType; // string
  const amenities: string[] | any = req.query?.amenities; // array of string
  const bookingOptions: string[] | any = req.query?.bookingOptions; // array of string
  const hostLanguages: string[] | any = req.query?.hostLanguages; // array of string

  if (!minPrice || !maxPrice) {
    return res
      .status(400)
      .send({ message: "Both min price and max price are required!" });
  }

  try {
    const filter: any = {
      price: { $gte: minPrice, $lte: maxPrice },
      propertyType,
    };

    // Adding filters for amenities, bookingOptions, and hostLanguages if they exist
    if (amenities && amenities.length > 0) {
      filter.amenities = { $all: amenities };
    }
    if (bookingOptions && bookingOptions.length > 0) {
      filter.bookingOptions = { $all: bookingOptions };
    }
    if (hostLanguages && hostLanguages.length > 0) {
      filter.hostLanguages = { $all: hostLanguages };
    }

    // Use countDocuments instead of estimatedDocumentCount for filtering
    const propertiesCount = await propertiesCollection.countDocuments(filter);

    res.send({ count: propertiesCount });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while filtering properties." });
  }
};

export const filterProperty = async (
  req: Request,
  res: Response
): Promise<any> => {
  const db = getDB();
  const propertiesCollection = await getPropertiesCollection(db);

  const minPrice = Number(req.query?.minPrice);
  const maxPrice = Number(req.query?.maxPrice);
  const propertyType = req.query?.propertyType; // string
  const amenities: string[] | any = req.query?.amenities; // array of string
  const bookingOptions: string[] | any = req.query?.bookingOptions; // array of string
  const hostLanguages: string[] | any = req.query?.hostLanguages; // array of string

  if (!minPrice || !maxPrice) {
    return res
      .status(400)
      .send({ message: "Both min price and max price are required!" });
  }

  try {
    const filter: any = {
      price: { $gte: minPrice, $lte: maxPrice },
      propertyType,
    };

    // Adding filters for amenities, bookingOptions, and hostLanguages if they exist
    if (amenities && amenities.length > 0) {
      filter.amenities = { $all: amenities };
    }
    if (bookingOptions && bookingOptions.length > 0) {
      filter.bookingOptions = { $all: bookingOptions };
    }
    if (hostLanguages && hostLanguages.length > 0) {
      filter.hostLanguages = { $all: hostLanguages };
    }

    const properties = await propertiesCollection.find(filter).toArray();

    res.send(properties);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while filtering properties." });
  }
};

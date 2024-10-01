export interface Property {
  images: string[];
  location: string;
  price: number;
  rating: number;
  startDate: number;
  endDate: number;
  amenities: string[];
  propertyType: string;
  author: {
    name: string;
    image: string;
  };
}

  
  export const getPropertiesCollection = (db: any) => {
    return db.collection("properties");
  };
  
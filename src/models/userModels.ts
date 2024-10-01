export interface User {
    name: string;
    email: string;
  }
  
  export const getUsersCollection = (db: any) => {
    return db.collection("users");
  };
  
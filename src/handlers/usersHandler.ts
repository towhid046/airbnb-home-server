import { Application, Request, Response } from "express";

export const getUsersHandler = async (req: Request, res: Response) => {
   res.send("Hello from another module!users");
};

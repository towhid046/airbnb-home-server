import express, { Application } from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import propertiesRoutes from "./routes/propertyRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use(propertiesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
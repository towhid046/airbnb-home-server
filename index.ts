import express, { Application } from "express";
import { connectDB } from "./src/config/db";
import dotenv from "dotenv";
import cors from "cors";
import propertiesRoutes from "./src/routes/propertyRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://airbnb-home-client-s4nm.vercel.app"],
  })
);
app.use(express.json());

// Routes
app.get('/', (req,res)=>{
res.send('Airbnb server is running...')  
})
app.use(propertiesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

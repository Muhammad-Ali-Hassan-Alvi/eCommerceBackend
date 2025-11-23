import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js"

connectDB();
const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.send("Every thing Running Good!");
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

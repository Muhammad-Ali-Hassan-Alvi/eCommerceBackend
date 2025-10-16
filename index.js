import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";

connectDB();
const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/routes.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
// cors
app.use(express.json());
app.use(
  cors({
    origin: "*",
    withCredentials: true,
  })
);
// configs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// routes
app.get("/", (_, res) => {
  res.send("Welcome to the Express API!");
});

// 404 route
app.get("/api", router);
app.use((_, res, next) => {
  res.status(404).send("404 Not Found");
});

// mongoose connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

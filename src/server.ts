import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/user";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running..");
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

app.use("/trullo", userRoutes);

export default app;

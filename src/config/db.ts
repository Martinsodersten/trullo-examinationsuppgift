import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URI as string);
    console.log("Connected to Trullo Database");
  } catch (error) {
    console.error("Error connecting to MongoDB");
    process.exit(1);
  }
};

export default connectDB;

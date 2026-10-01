import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/posts_routes.js";
import userRoutes from "./routes/user_routes.js";
import teamRoutes from "./routes/team_routes.js";
import aiRoutes from "./routes/ai_routes.js";

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.static("uploads"));

const port = process.env.PORT || 5000;

app.use(postRoutes);
app.use(userRoutes);
app.use(teamRoutes);
app.use(aiRoutes);

const connectData = async() => {
    try {
        await mongoose.connect(process.env.ATLASDB_URL);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectData();
});

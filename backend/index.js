import express from "express";
import { chats } from "./data/data.js";
import { connectDB } from "./config/db.js";
import  dotenv  from "dotenv"; 
import  userRoutes  from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const PORT = process.env.PORT;
connectDB();
const app = express();
app.use(express.json()); // since we accept data from frontend

// Route handler for HTTP GET for root of app /
app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);


// /api/chats get, send all dummy chats
app.get("/api/chats", (req, res) => {
    res.send(chats);
});

// when id is specified, log id and search chats object for chat whose id matches requested id, 
// and send it in resonse
// .find(x) , where x is a function which determines if find returns true based on function evaluation
app.get("/api/chats/:id", (req, res) => {
    console.log(req.params.id);
    const oneChat = chats.find(c => c._id === req.params.id);
    res.send(oneChat);
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
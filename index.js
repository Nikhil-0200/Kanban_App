import express from "express";
import cors from "cors";
import connection from "./config/db.js";
import userRouter from "./routes/user.route.js";
import noteRouter from "./routes/note.route.js";
import auth from "./middleware/auth.middleware.js";

const PORT = process.env.PORT || 3009;
const server = express();

server.use(cors({
    origin: "*"
}));

server.use(express.json());
server.use("/user", userRouter)
server.use("/note", auth, noteRouter)


server.get("/", (req, res)=>{
    res.send("Hello World")
})

server.listen(PORT, async (req, res)=>{
    try {
        await connection;
        console.log(`Server is running at port ${PORT} & DB is connected`);
    } catch (error) {
        console.log(`Error in running server ${error}`);
    }
})
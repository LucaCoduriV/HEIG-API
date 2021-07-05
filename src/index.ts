import dotenv from "dotenv";
import express from "express";
import router from "./routes";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT;
const NODE_ENV = process.env.NODE_ENV;

app.use(cors());
app.use(morgan(NODE_ENV == "development" ? "dev" : "combined"));
app.use(router);

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});

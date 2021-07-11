import dotenv from "dotenv";
import express from "express";
import router from "./routes";
import morgan from "morgan";
import cors from "cors";
import { json } from "body-parser";
import { RsaManager } from "./utils/rsaUtils";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT;
const NODE_ENV = process.env.NODE_ENV;
RsaManager.getInstance();

app.use(cors());
app.use(json());
app.use(morgan(NODE_ENV == "development" ? "dev" : "combined"));
app.use(router);

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});

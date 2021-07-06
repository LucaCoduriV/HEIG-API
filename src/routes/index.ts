import express from "express";
import getNotes from "../controllers/getNotes";
import { query, validationResult } from "express-validator";
import getHoraires from "../controllers/getHoraires";

const router = express.Router();

router.get(
    "/notes",
    query("username").isLength({ min: 3 }),
    query("password").isLength({ min: 4 }),
    getNotes
);

router.get(
    "/horaires",
    query("username").isLength({ min: 3 }),
    query("password").isLength({ min: 4 }),
    getHoraires
);

export default router;

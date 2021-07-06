import express from "express";
import puppeteer from "puppeteer";
import getNotes from "../controllers/getNotes";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.get(
    "/notes",
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 4 }),
    getNotes
);

export default router;

import express from "express";
import getNotes from "../controllers/getNotes";
import { query, validationResult } from "express-validator";

const router = express.Router();

router.get(
  "/notes",
  query("username").isLength({ min: 3 }),
  query("password").isLength({ min: 4 }),
  getNotes
);

export default router;

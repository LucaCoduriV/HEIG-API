import express from "express";
import getNotes from "../controllers/getNotes";
import { query, validationResult } from "express-validator";
import getHoraires from "../controllers/getHoraires";
import login from "../controllers/login";

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
// il faut peut-être changer la méthode get pour post car dans l'historique les mot de passe seront affiché en claire.
router.get(
    "/login",
    query("username").isLength({ min: 3 }),
    query("password").isLength({ min: 4 }),
    login
);

export default router;

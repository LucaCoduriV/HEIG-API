import express from "express";
import getNotes from "../controllers/getNotes";
import { query, validationResult, body } from "express-validator";
import getHoraires from "../controllers/getHoraires";
import login from "../controllers/login";
import getPublicKey from "../controllers/getPublicKey";
import encryptData from "../controllers/encryptData";
import decrypt from "../middlewares/decrypt";

const router = express.Router();

router.post(
    "/notes",
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 4 }),
    decrypt,
    getNotes
);

router.post(
    "/horaires",
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 4 }),
    decrypt,
    getHoraires
);
// il faut peut-être changer la méthode get pour post car dans l'historique les mot de passe seront affiché en claire.
router.post(
    "/login",
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 4 }),
    decrypt,
    login
);

router.get("/public_key", getPublicKey);
router.get("/encryptdata", encryptData); // pour tester seulement

export default router;

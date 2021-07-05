import express from "express";
const router = express.Router();

// define the home page route
router.get("/", function (req, res) {
    res.send("HELLO WORLD !");
});

export default router;

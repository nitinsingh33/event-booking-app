import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Server is working fine!" });
});

export default router;
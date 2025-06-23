const express = require("express");
const router = express.Router();

// Post Rout
// Index
router.get("/", (req, res) => {
    res.send("Get for posts");
});

// Show
router.get("/:id", (req, res) => {
    res.send("Get for show posts");
});

// Post
router.post("/", (req, res) => {
    res.send("Post for posts");
});

// Delete
router.delete("/:id", (req, res) => {
    res.send("Delete for posts");
});

module.exports = router;
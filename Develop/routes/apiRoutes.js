const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

module.exports = router;

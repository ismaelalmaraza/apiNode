const express = require("express");

const router = express.Router();
const readLastLines = require("read-last-lines");
const path = require("path");

// Logs
router.get("/latest", (req, res) => {
  const maxLines = 100;
  readLastLines
    .read(path.resolve(__dirname, `../${global.config.logs.name}`), maxLines)
    .then(lines => {
      const dat = lines.replace(/\\n|\\/g, "");
      res.render("index.html", { dat });
    })
    .catch(error => {
      res.send("No existen logs");
    });
});

module.exports = router;

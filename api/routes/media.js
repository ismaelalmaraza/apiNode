const express = require("express");

const router = express.Router();

const mediaController = require("../controller/MediaController");
const logger = require("../services/loggerWinston");

router.get("/storage/evidence/:surveyId/:answerId", function(req, res) {
  logger.info("show resources");
  res.render("resource.html", {
    surveyId: req.params.surveyId,
    answerId: req.params.answerId,
    url: process.env.apiUrl || ""
  });
});

router.get(
  "/storage/evidence/resource/:surveyId/:answerId",
  mediaController.getEvidence
);

router.get("/storage/:surveyId/:answerId", mediaController.getMedia);

module.exports = router;

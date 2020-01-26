const express = require("express");

const router = express.Router();

const {
  check,
  validationResult,
  checkSchema
} = require("express-validator/check");

const shortid = require("shortid");
const answerController = require("../controller/answerController");
const elementController = require("../controller/elementController");

function validation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const response = { errors: errors.array() };
    return res.status(422).json(response);
  }
  req.transactionId = shortid.generate();
  return next();
}

router.post(
  "/",
  [
    check("_id")
      .exists()
      .withMessage("The parameter _id not should be empty"),
    check("metadata")
      .exists()
      .withMessage("The parameter metadata not should be empty"),

    check("response")
      .exists()
      .withMessage("The parameter not should be empty"),

    validation
  ],
  answerController.saveAnswer
);
router.get(
  "/:id",
  checkSchema({
    id: {
      in: ["params", "query"],
      errorMessage: "the answerId is not valid"
      // isInt: true,
      // toInt: true
    }
  }),
  validation,
  answerController.getAnswer
);
router.delete(
  "/:id",
  checkSchema({
    id: {
      in: ["params", "query"],
      errorMessage: "the answerId is not valid",
      isInt: true,
      toInt: true
    }
  }),
  validation,
  answerController.deleteAnswer
);
router.put(
  "/:id/:answerName",
  checkSchema({
    id: {
      in: ["params", "query"],
      errorMessage: "the answerId is not valid",
      isInt: true,
      toInt: true
    },
    answerName: {
      in: ["params", "query"],
      errorMessage: "the answerName is not valid",
      isInt: false,
      toInt: false
    }
  }),
  validation,
  answerController.updateAnswer
);
router.get("/list/all", answerController.getAnswers);

router.post(
  "/:id/download-report",
  [
    check("startDate")
      .exists()
      .withMessage("The parameter startDate not should be empty"),
    check("endDate")
      .exists()
      .withMessage("The parameter endDate not should be empty"),
    validation
  ],
  answerController.getReport
);

// match url => directory/environment/Evidence/surveyId/mediaId
router.get(
  "/media/:directory/:environment?/:Evidence/:surveyId/:mediaId",
  answerController.getMedia
);

router.get("/download-media/:fileName", answerController.downloadMedia);

router.get(
  "/elements/:surveyId/:questionId/:userId?",
  elementController.getElementsByQuestionId
);

router.get("/analytics/bysurvey", elementController.getAnalytics);

router.post("/byClient", answerController.countAnswersByClient);
module.exports = router;

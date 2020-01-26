const express = require("express");

const router = express.Router();

const { check, checkSchema } = require("express-validator/check");

const surveyController = require("../controller/surveyController");
const { validation } = require("./middleware");

// Survey API
router.post(
  "/",
  [
    check("survey").exists(),
    check("surveyName")
      .exists()
      .isString()
      .withMessage("The parameter must be string type")
      .isLength({ min: 5 })
      .withMessage("The minimum length of surveyName is 5"),
    validation
  ],
  surveyController.store
);

router.put(
  "/:id",
  checkSchema({
    id: {
      in: ["params", "query"],
      errorMessage: "the id is not valid",
      isInt: false,
      toInt: false
    }
  }),
  check("survey").exists(),
  check("surveyName")
    .exists()
    .isString()
    .withMessage("The parameter must be string type")
    .isLength({ min: 5 })
    .withMessage("The minimum length of surveyName is 5"),
  validation,
  surveyController.update
);

router.delete(
  "/:id",
  checkSchema({
    id: {
      in: ["params", "query"],
      errorMessage: "the surveyId is not valid",
      isInt: false,
      toInt: false
    }
  }),
  validation,
  surveyController.delete
);

router.get(
  "/:id",
  checkSchema({
    id: {
      in: ["params", "query"],
      errorMessage: "the surveyId is not valid",
      isInt: false,
      toInt: false
    }
  }),
  validation,
  surveyController.getSurvey
);
router.get("/", surveyController.getSurveys);

router.get("/disable/:id", surveyController.disable);
router.get("/enable/:id", surveyController.enable);
router.post("/list", surveyController.getListSurveys);
router.get("/latests/answers/location", surveyController.getLatests);

router.post("/save/media/storage", surveyController.saveMedia);
router.get("/unique/id", surveyController.getId);

module.exports = router;

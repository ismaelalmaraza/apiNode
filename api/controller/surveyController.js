const mongoose = require("mongoose");
const shortid = require("shortid");
require("../models/survey");

const Survey = require("../models/survey");
const surveyAnswered = require("../models/surveyAnswered");

mongoose.model("survey");
const logger = require("../services/loggerWinston");
const SurveyService = require("../services/survey");

// TODO: Fix function error
function error(err, req, res) {
  const Error = {
    err,
    reqId: req.id
  };
  // console.error(err);
  logger.error("Error: ", err);

  return res.status(500).json({
    code: 0,
    mensaje: `Error: ${JSON.stringify(err, null, 4)}`,
    transactionId: req.transactionId
  });
}

module.exports.store = async function(req, res) {
  try {
    logger.info("create survey: ", {
      surveyName: req.body.surveyName,
      transactionId: req.transactionId
    });
    let { body } = req;
    body = JSON.stringify(body).trim();
    body = JSON.parse(body);
    const request = {
      survey: JSON.stringify(body.survey),
      // .trim('"')
      // .replace(/\\/g, ""),
      surveyName: req.body.surveyName,
      transactionId: req.transactionId,
      description: body.survey.description,
      startValidationDate: body.survey.firstValidationDate,
      endValidationDate: body.survey.endValidationDate,
      _id: req.body._id,
      required: body.survey.required
    };

    // console.log(request);

    const surveyService = new SurveyService(request);
    const result = await Survey.saveSurvey(surveyService.clearRequest());

    // console.log(result);
    // process.exit();
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(340).json({
        response: false,
        message: "A survey with the same name already exists"
      });
    }
  } catch (err) {
    console.log(err);
    error(err, req, res);
  }
};

module.exports.update = async function(req, res) {
  try {
    let request = {
      id: req.params.id,
      survey: req.body.survey,
      surveyName: req.body.surveyName,
      transactionId: req.transactionId,
      description: req.body.survey.description,
      startValidationDate: req.body.survey.firstValidationDate,
      endValidationDate: req.body.survey.endValidationDate,
      required: req.body.survey.required
    };

    const surveyService = new SurveyService(request);
    // request = surveyService.getImagePicker(request.id);

    const queryConfiguration = {
      query: { _id: request.id },
      command: surveyService.clearRequestUpdate(true) // true if survey to string else object
    };

    let uSurvey = await Survey.updateSurvey(queryConfiguration);
    if (uSurvey) {
      return res.status(200).json({
        response: uSurvey
      });
    }
    // TODO: Si no exite el registro mandar mensaje de que el registro no exite.
  } catch (e) {
    console.log(e);
    error(e, req, res);
  }
};

module.exports.disable = async (req, res) => {
  try {
    let survey = {
      id: req.params.id,
      transactionId: req.transactionId
    };

    const queryConfiguration = {
      query: { _id: survey.id },
      command: { $set: { delete: true } }
    };

    let dSurvey = await Survey.state(queryConfiguration);
    return res.status(200).json({
      response: dSurvey
    });
  } catch (e) {
    error(e, req, res);
  }
};

module.exports.enable = async (req, res) => {
  try {
    const survey = {
      id: req.params.id,
      transactionId: req.transactionId
    };

    const queryConfiguration = {
      query: { _id: survey.id },
      command: { $unset: { delete: true } }
    };

    let dSurvey = await Survey.state(queryConfiguration);
    return res.status(200).json({
      response: dSurvey
    });
  } catch (error) {}
};

module.exports.delete = async (req, res) => {
  try {
    let survey = {
      id: req.params.id,
      transactionId: req.transactionId
    };

    const queryConfiguration = {
      query: { _id: survey.id }
    };

    let dSurvey = await Survey.deleteSurvey(queryConfiguration);
    return res.status(200).json({
      delete: true
    });
  } catch (e) {
    error(e, req, res);
  }
};

module.exports.getSurvey = async (req, res) => {
  try {
    const request = {
      id: req.params.id,
      transactionId: req.transactionId
    };

    const queryConfiguration = {
      query: { _id: request.id },
      fields: "survey"
    };

    let survey = await Survey.findSurvey(queryConfiguration);
    return res.status(200).json({
      response: survey
    });
  } catch (e) {
    error(e, req, res);
  }
};

module.exports.getSurveys = async (req, res) => {
  try {
    let fields = req.query.fields;
    let queryConfiguration = {
      query: {},
      fields: {}
    };
    if (fields) {
      fields = fields.split(",").filter(field => field != "");
      fields.forEach(field => {
        queryConfiguration.fields[field] = 1;
      });
    } else {
      queryConfiguration.fields["surveyAnswered"] = 0;
    }
    const result = await Survey.listWithCoutnAnwers(queryConfiguration);
    return res.status(200).json({
      response: result,
      count: Array.isArray(result) ? result.length : []
    });
  } catch (e) {
    error(e, req, res);
  }
};

module.exports.getListSurveys = async (req, res) => {
  try {
    let request = {
      surveys: req.body.surveys
    };

    const queryConfiguration = {
      query: {
        _id: { $in: request.surveys }
      },
      fields: { surveyAnswered: 0 }
    };

    let response = await Survey.list(queryConfiguration);
    return res.status(200).json({
      response
    });
  } catch (e) {
    error(e, req, res);
  }
};

module.exports.getLatests = async (req, res) => {
  try {
    let records = await Survey.getLatestElementsByLimit();

    return res.status(200).json({
      response: records
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.saveMedia = (req, res) => {
  try {
    let fileName = req.body.name;
    let body = req.body.data;

    // console.log(fileName);
    // console.log(body);

    let surveyService = new SurveyService({});
    surveyService.saveMedia(fileName, body);

    return res.json({
      response: "ok"
    });
  } catch (e) {
    error(e, req, res);
  }
};

module.exports.getId = (req, res) => {
  try {
    const mongoose = require("mongoose");
    let id = new mongoose.Types.ObjectId();

    return res.status(200).json({
      response: id
    });
  } catch (e) {
    error(e, req, res);
  }
};

// const Answer = require("../models/answer");
const Survey = require("../models/survey");
const Elements = require("../services/elements");
const logger = require("../services/loggerWinston");
const parallel = require("async").parallel;
const El = require("../services/answerService");
const ObjectID = require("mongodb").ObjectID;
const surveyAnswered = require("../models/surveyAnswered");
const { validateDate } = require("../services/repository.js");
const AnswerAnalytics = require("../services/answer");
const Clear = require("../services/clear");
const fs = require("fs");
const util = require("util");
const moment = require("moment");
const path = require("path");
const xl = require("excel4node");

module.exports.insertElements = async data => {
  logger.info("save survey elements");
  try {
    const { dataSurvey, dataAnswer } = data;
    // console.log(dataAnswer);
    let { survey } = dataSurvey;
    let { answer } = dataAnswer;
    let surveyId = dataSurvey._id;
    let answerId = dataAnswer._id;
    let userId = dataAnswer.userId;

    answer = JSON.parse(answer);
    let questions = [];
    JSON.parse(survey).pages.map((data, index) => {
      questions.push(...data.questions);
    });

    surveyComplete = questions.map((question, index) => {
      if (answer[index].QuestionId === question.id) {
        question.answer = answer[index].Answer;
        question.survey = surveyId;
        question.surveyAnswered = answerId;
        question.userId = userId;
        return question;
      } else {
        let error = new Error();
        error.message = "The id of the question and the answer does not match";
        throw error;
      }
    });
    await Answer.insertRecords(surveyComplete);
  } catch (error) {
    logger.error("save survey elements", error);
    throw error;
  }
};

module.exports.getElementsByQuestionId = async (req, res) => {
  try {
    const element = {
      surveyId: req.params.surveyId,
      questionId: req.params.questionId,
      userId: req.params.userId ? req.params.userId : null
    };

    const queryConfiguration = {
      query: { _id: element.surveyId },
      fields: {}
    };
    // query survey db
    let surveyData = await Survey.findSurvey(queryConfiguration);
    let { survey } = surveyData;
    survey = JSON.parse(survey);
    let questions = [];
    survey.pages.find(q => {
      questions.push(...q.questions);
    });

    let question = questions.find(q => {
      return q.id === element.questionId;
    });

    // query answers db
    let query = {
      survey: element.surveyId,
      id: element.questionId
    };

    if (element.userId) {
      query.userId = element.userId;
    }

    let answers = await Answer.find(query);

    let elements = new Elements();
    // * set analythics configuration
    elements[question.type](question);

    let geo = [];
    // TODO: verificar donde se crea los atributos hay un fallo con 'column' debe ser 'columns'
    // console.log(answers);
    // console.log("###################");
    answers.forEach((data, i) => {
      let { type } = data;
      elements[type](data);
    });

    // TODO: regresar Geolocalizacion general por pregunta
    return res.status(200).json({
      ok: true,
      countAnswers: answers.length,
      title: question.title,
      type: question.type,
      // response: elements.checkboxAnalythics
      response: elements.analythics,
      totalAnswers: answers.length
    });
  } catch (error) {
    logger.error("error: ", error);
    return res.status(400).json({
      ok: false,
      error: error.stack
    });
  }
};

module.exports.getAnalytics = async (req, res) => {
  try {
    if (req.query.download) {
      return download(req, res);
    }
    let request = {};
    let _id = ObjectID(req.query.surveyId);
    req.query.userId ? (request.userId = req.query.userId) : "";
    let dates = validateDate(req.query.startDate, req.query.endDate);
    if (dates === 1) {
      request.startDate = req.query.startDate;
      request.endDate = req.query.endDate;
    }

    let surveyData = await Survey._customPopulate({ _id: _id }, request);
    let { surveyAnswered, survey } = surveyData[0];
    survey = JSON.parse(survey);
    let surveyQuestions = [];
    survey.pages.forEach(q => {
      surveyQuestions.push(...q.questions);
    });

    let arrayFunctions = [];
    var incomplete = 0;
    var complete = 0;
    let questions = {};
    surveyAnswered.forEach(answerData => {
      arrayFunctions.push(function(callback) {
        let answer =
          typeof answerData.answer === "string"
            ? JSON.parse(answerData.answer)
            : answerData.answer;

        let incomplete = answer.filter(a => a.Answer === null).length;

        for (let i = 0; i < answer.length; i++) {
          const a = answer[i];
          let q = surveyQuestions.find(s => s.id === a.QuestionId);

          // if (!q) {
          //   let error = new Error();
          //   error.code = error.code || 430;
          //   callback(error, null);
          // }

          if (typeof q === "undefined") {
            // response.push("¡El tipo de la pregunta fue modificada!|");
            continue;
          }

          let question = Object.assign(a, q);

          if (!questions[question.QuestionId]) {
            questions[question.QuestionId] = [];
          }
          questions[question.QuestionId].push(question);
        }

        callback(null, incomplete);
      });
    });

    parallel(arrayFunctions, function(err, results) {
      if (err) throw err;
      incomplete = results.filter(result => result !== 0).length;
      complete = results.length - incomplete;
    });

    let keys = Object.keys(questions);
    let arrayQuestionsFunction = [];
    keys.forEach(key => {
      arrayQuestionsFunction.push(function(callback) {
        let elements = new El();

        let answers = questions[key];
        elements[answers[0].type](answers[0]);

        answers.forEach(answer => {
          elements[answer.type](answer);
        });

        let response = {
          type: answers[0].type,
          title: answers[0].title ? answers[0].title : answers[0].Question,
          response: elements.analythics
        };

        callback(null, response);
      });
    });

    parallel(arrayQuestionsFunction, function(err, results) {
      if (err) throw err;

      return res.status(200).json({
        ok: true,
        response: results,
        complete,
        incomplete,
        total: complete + incomplete
      });
    });
  } catch (error) {
    console.log(error);

    let code = error.code === 430 ? 430 : 400;

    res.status(code).json({
      error: true,
      error: error.stack
    });
  }
};

async function download(req, res) {
  try {
    let request = {};
    let _id = ObjectID(req.query.surveyId);
    req.query.userId ? (request.userId = req.query.userId) : "";
    let dates = validateDate(req.query.startDate, req.query.endDate);
    if (dates === 1) {
      request.startDate = req.query.startDate;
      request.endDate = req.query.endDate;
    }

    let surveyData = await Survey._customPopulate({ _id: _id }, request);
    let { surveyAnswered, survey, surveyName } = surveyData[0];
    survey = JSON.parse(survey);
    let surveyQuestions = [];
    survey.pages.forEach(q => {
      surveyQuestions.push(...q.questions);
    });

    let headers = ["Encuesta", "Fecha", "Hora", "Usuario"];
    surveyQuestions.forEach(s => {
      headers.push(s.title);
      headers.push("Latitud");
      headers.push("Longitud");
      headers.push("Altitud");
    });

    const fileName = `${new Date().toISOString()}_survey.csv`;
    let filePath = path.resolve("./services/temp", fileName);
    // write headers csv

    // se comenta por que ya no se usa el guardado de archivo csv
    // fs.writeFileSync(filePath, headers.join("|") + "\n", "utf8");

    let arrayFunctions = [];
    var incomplete = 0;
    var complete = 0;
    let questions = {};
    surveyAnswered.forEach(answerData => {
      // console.log(answerData);
      arrayFunctions.push(function test(callback) {
        let { userId, updatedAt, _id, survey } = answerData;
        let surveyId = survey.shift();
        let answerId = _id;
        let clear = new Clear();
        let answer =
          typeof answerData.answer === "string"
            ? JSON.parse(answerData.answer)
            : answerData.answer;
        let response = [];

        for (let i = 0; i < answer.length; i++) {
          const a = answer[i];
          let q = surveyQuestions.find(s => s.id === a.QuestionId);

          if (typeof q === "undefined") {
            response.push(
              "¡El tipo de la pregunta fue modificada!",
              "",
              "",
              ""
            );
            continue;
          }

          let question = Object.assign(a, q);
          question.answerId = answerId;
          question.surveyId = surveyId;
          let location = question.QuestionLocation;
          let r = clear[question.type](question);
          // console.log(r);
          response.push(
            util.inspect(r).replace(/\\n|\\|\'/g, ""),
            // .replace(/\,/g, "|")
            // .replace(/\|/g, " |"),
            location && location.Latitude ? location.Latitude : "",
            location && location.Longitude ? location.Longitude : "",
            location && location.Altitude ? location.Altitude : ""
          );
        }
        callback(null, { response, surveyName, userId, updatedAt });
      });
    });

    parallel(arrayFunctions, function(err, results) {
      if (err) throw err;
      var wb = new xl.Workbook();
      var ws = wb.addWorksheet("Sheet 1");
      for (let i = 1; i <= headers.length; i++) {
        ws.cell(1, i).string(headers[i - 1]);
      }

      j = 2;
      k = 1;
      logger.info("write buffer xlxs");
      for (let i = 0; i < results.length; i++) {
        results[i].response.unshift(results[i].userId);
        results[i].response.unshift(
          moment(results[i].updatedAt).format("HH:mm:ss")
        );
        results[i].response.unshift(
          moment(results[i].updatedAt).format("DD-MM-YYYY")
        );
        results[i].response.unshift(results[i].surveyName);
        // fs.appendFileSync(
        //   filePath,
        //   results[i].response.join("|") + "\n",
        //   "utf8"
        // );

        // ws.cell(j, 1).string(results[i].surveyName);
        // ws.cell(j, 2).string(moment(results[i].updatedAt).format("DD-MM-YYYY"));
        // ws.cell(j, 3).string(moment(results[i].updatedAt).format("HH:mm:ss"));
        // ws.cell(j, 4).string(results[i].userId);

        // let q = 5;
        for (k = 0, q = 1; k < results[i].response.length; k++) {
          ws.cell(j, q).string(results[i].response[k].toString("utf8"));
          q++;
        }
        j++;
      }

      // wb.write("Excel.xlsx", fun);
      wb.writeToBuffer().then(function(buffer) {
        logger.info("finish write buffer xlxs");
        return res.send(buffer);
      });

      // Se comenta ya que no se utiliza el guardado de un archivo
      // res.header("Access-Control-Allow-Origin", "*");
      // fs.readFile(filePath, "utf8", function(err, data) {
      //   if (err) throw err;
      //   return res.download(filePath, fileName, function(e) {
      //     if (e) {
      //       throw e;
      //     } else {
      //       // fs.unlinkSync(filePath);
      //       fs.unlink(filePath, err => {
      //         if (err) throw err;
      //       });
      //     }
      //   });
      // });

      // return res.status(200).json({
      //   ok: true,
      //   download: true
      // });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      error: error.stack
    });
  }
}

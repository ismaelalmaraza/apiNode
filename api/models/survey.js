const mongoose = require("mongoose");
const { isValid } = require("../services/repository");
const SurveyService = require("../services/survey");

const { Schema } = mongoose;

const surveySchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    survey: { type: String },
    surveyName: { type: String },
    description: { type: String },
    startValidationDate: { type: Date },
    endValidationDate: { type: Date },
    assignment: { type: Object },
    delete: { type: Boolean },
    required: { type: Boolean, default: false },
    surveyAnswered: [{ type: Schema.Types.ObjectId, ref: "SurveyAnswered" }]
  },
  { timestamps: true }
);

const Survey = mongoose.model("survey", surveySchema);
module.exports = mongoose.model("survey", surveySchema);

async function saveSurvey(survey) {
  try {
    // validation survey name
    let { surveyName } = survey;
    let record = await Survey.find({ surveyName });
    if (record.length === 0) {
      // save survey

      // Se comenta por que ya no es necesario generar el id ya que este es generado una ves que el
      // generador de encuestas es abierto.

      // survey._id = new mongoose.Types.ObjectId();
      // save media
      // survey = saveStorageMedia(survey, survey._id);
      const newSurvey = new Survey(survey);
      const result = await newSurvey.save();
      return result;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

// Se comenta la funcion ya que desde el generador se hacer el guardado de imagenes.
// function saveStorageMedia(record, id) {
//   let surveyService = new SurveyService(record);
//   return surveyService.getImagePicker(id);
// }

async function updateSurvey(queryConfiguration) {
  try {
    const { query, command } = queryConfiguration;
    let survey = await Survey.findOneAndUpdate(query, command, { new: true });
    return isValid(survey) ? survey : false;
  } catch (error) {
    throw error;
  }
}

async function state(queryConfiguration) {
  try {
    const { query, command } = queryConfiguration;
    let survey = await Survey.findOneAndUpdate(query, command, { new: true });
    return survey;
  } catch (error) {
    throw error;
  }
}

async function deleteSurvey(queryConfiguration) {
  try {
    const { query } = queryConfiguration;
    let survey = await Survey.deleteOne(query);
    return isValid(survey) ? survey : false;
  } catch (error) {
    throw error;
  }
}

async function findSurvey(queryConfiguration) {
  try {
    const { query } = queryConfiguration;
    let survey = await Survey.findOne(query);
    return isValid(survey) ? survey : false;
  } catch (error) {
    throw error;
  }
}

async function findAll(queryConfiguration) {
  try {
    const { query, fields } = queryConfiguration;
    let surveys = Survey.find(query, fields);
    return isValid(surveys) ? surveys : false;
  } catch (error) {
    throw error;
  }
}

async function populate(query) {
  try {
    const result = await Survey.find(query)
      .populate({ path: "surveyAnswered", select: "metadata answer userId" })
      .exec();
    return result;
  } catch (error) {
    throw error;
  }
}

async function customPopulate(query, userId) {
  try {
    const userQuery = userId ? { userId: userId } : {};

    const result = await Survey.find(query)
      .populate({
        path: "surveyAnswered",
        match: userQuery,
        select: "answer userId updatedAt"
      })
      .exec();
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
}

// async function customPopulate(query) {
//   try {
//     const result = await Survey.find(query)
//       .populate({ path: "surveyAnswered", select: "answer userId" })
//       .exec();
//     return result;
//   } catch (error) {
//     throw error;
//   }
// }

async function pushSurveyAnswered(answer) {
  try {
    const { id } = answer;
    const survey = await Survey.findOne({ _id: id });
    survey.surveyAnswered.push(answer._id);
    await survey.save();

    return { dataSurvey: survey, dataAnswer: answer };
  } catch (error) {
    throw error;
  }
}

function SurveyResponse(code, survey, count) {
  this.code = code;
  this.response = survey;
  this.count = count;
}

function SurveyResponseError(name, message, number) {
  this.customError = new Error();
  this.customError.name = name;
  this.customError.message = message;
  this.customError.number = number;
}

async function list(queryConfiguration) {
  try {
    let { query, fields } = queryConfiguration;
    let response = await Survey.find(query, fields);
    // console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
}

async function listWithCoutnAnwers() {
  const SurveyAnwed = require("./surveyAnswered").SurveyAnwed;
  const moment = require("moment");
  try {
    let surveys = await Survey.find(
      {},
      {
        surveyName: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        survey: 1,
        delete: 1
      }
    );

    var date = new Date();
    date.setDate(date.getDate() - 9);
    date.setHours(0, 0, 0, 0);
    arrayDates = [];
    for (let i = 9; i >= 0; i--) {
      let d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      arrayDates.push(d.toISOString().slice(0, 10));
    }

    let dates = await SurveyAnwed.aggregate([
      {
        $match: {
          // survey: mongoose.Types.ObjectId("5d9f90a433fa16ce3b9e0bfd"),
          updatedAt: {
            $gt: date
          }
        }
      },
      { $unwind: { path: "$survey" } },
      {
        $group: {
          _id: {
            answerDate: {
              $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
            },
            survey: "$survey"
            // __v: "$__v"
          },
          count_: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.answerDate": 1 }
      }
    ]);

    let format = dates.map(d => {
      return {
        date_: d._id.answerDate,
        _id: d._id.survey,
        count: d.count_
      };
    });

    // console.log(format);
    // console.log(date.getDate());
    // console.log(new Date());

    // let array = {};
    // format.forEach(element => {
    //   !array[element._id]
    //     ? ((array[element._id] = []), array[element._id].unshift(element.count))
    //     : array[element._id].unshift(element.count);
    // });

    let o = {};
    format.forEach(e => {
      if (!o[e._id]) {
        o[e._id] = new Array(10).fill(0);
        let index = arrayDates.findIndex(a => {
          return a == e.date_;
        });
        o[e._id][index] = e.count;
      } else {
        let index = arrayDates.findIndex(a => {
          return a == e.date_;
        });
        o[e._id][index] = e.count;
      }
    });

    // console.log(array);

    let exit = surveys.map(survey => {
      return {
        survey: survey.survey,
        surveyName: survey.surveyName,
        _id: survey._id,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt,
        values: o[survey._id] ? o[survey._id] : [],
        __v: survey.__v,
        delete: survey.delete
      };
    });

    return exit;

    // console.log(exit);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function customError(name, message, code = 0) {
  let e = new Error();
  (e.name = name), (e.message = message);
  e.code = code;
  return e;
}

async function getLatestElementsByLimit() {
  try {
    const SurveyAnwed = require("./surveyAnswered").SurveyAnwed;
    let records = await SurveyAnwed.find(
      {},
      { metadata: 1, userId: 1, updatedAt: 1 }
    )
      .sort({ _id: -1 })
      .limit(10)
      .populate({
        path: "survey",
        select: "surveyName"
      })
      .exec();
    let response = records.map(record => {
      return {
        metadata:
          typeof record.metadata === "string"
            ? JSON.parse(record.metadata)[0]
            : record.metadata[0],
        userId: record.userId,
        updatedAt: record.updatedAt,
        surveyName: record.survey[0].surveyName
      };
    });

    // console.log(response);

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function _customPopulate(query, match) {
  try {
    customQuery = {};
    if (match.startDate && match.endDate) {
      customQuery = {
        createdAt: { $gte: match.startDate },
        updatedAt: { $lte: match.endDate }
      };
    } else if (match.startDate) {
      customQuery = {
        updatedAt: { $gte: match.startDate }
      };
    }
    match.userId ? (customQuery.userId = match.userId) : "";

    const result = await Survey.find(query)
      .populate({
        path: "surveyAnswered",
        match: customQuery,
        select: "answer userId updatedAt survey"
      })
      .exec();
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  saveSurvey,
  updateSurvey,
  deleteSurvey,
  findSurvey,
  findAll,
  SurveyResponse,
  SurveyResponseError,
  populate,
  pushSurveyAnswered,
  state,
  customPopulate,
  list,
  getLatestElementsByLimit,
  _customPopulate,
  listWithCoutnAnwers
};

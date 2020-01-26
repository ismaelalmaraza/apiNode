const mongoose = require("mongoose");
const Survey = require("../models/survey");
const elementController = require("../controller/elementController");

const surveyAnswered = new mongoose.Schema(
  {
    userId: {
      type: String
    },
    metadata: { type: Object },
    information: { type: Object },
    answer: { type: Object },
    delete: { type: Boolean },
    sha256Answer: { type: String },
    survey: [{ type: mongoose.Schema.Types.ObjectId, ref: "survey" }]
  },
  { timestamps: true }
);

const SurveyAnwed = mongoose.model("SurveyAnswered", surveyAnswered);
module.exports = SurveyAnwed;

async function save(newAnswer) {
  try {
    // console.log(newAnswer);
    newAnswer._id = new mongoose.Types.ObjectId();
    const Answer = new SurveyAnwed(newAnswer);
    await Answer.save();
    let surveyAnsweredData = await Survey.pushSurveyAnswered(newAnswer);
    // console.log(surveyAnsweredData);
    // await elementController.insertElements(surveyAnsweredData);

    return { save: !Answer.isNew, Answer };
  } catch (error) {
    throw error;
  }
}

async function answersQuery(query) {
  try {
    return await SurveyAnwed.find(query, { _id: 0, __v: 0 });
  } catch (error) {
    throw error;
  }
}

async function populate(query) {
  try {
    const result = await SurveyAnwed.find(query)
      .populate("survey")
      .exec();
    return result;
  } catch (error) {
    throw error;
  }
}

// select: 'name -_id',
async function populateOnlyFields(query) {
  try {
    const result = await SurveyAnwed.find(query)
      .populate({ path: "survey", select: "survey" })
      .exec();
    return result;
  } catch (error) {
    throw error;
  }
}

function findRelations(query) {
  return new Promise((resolve, reject) => {
    SurveyAnwed.findOne(query)
      .populate("survey")
      .exec((err, SurveyAnwed) => {
        if (err) reject(handleError(err));
        resolve(SurveyAnwed);
      });
  });
}

async function findSimple(query) {
  try {
    const result = await SurveyAnwed.findOne(query);
    return result;
  } catch (error) {
    throw error;
  }
}

async function queryCommand(query, command, options) {
  try {
    return await SurveyAnwed.findOneAndUpdate(query, command, options);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  SurveyAnwed,
  save,
  findRelations,
  answersQuery,
  findSimple,
  queryCommand,
  populate,
  populateOnlyFields
};

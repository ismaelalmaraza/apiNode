const mongoose = require("mongoose");
const { Schema } = mongoose;

const answerSchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String },
    name: { type: String },
    choices: { type: Array },
    answer: { type: Object },
    columns: { type: Array },
    rows: { type: Array },
    type: { type: String },
    userId: { type: String },
    survey: [{ type: Schema.Types.ObjectId, ref: "survey" }],
    surveyAnswered: [{ type: Schema.Types.ObjectId, ref: "SurveyAnswered" }]
  },
  { timestamps: true }
);

const Answer = mongoose.model("answer", answerSchema);
module.exports = mongoose.model("answer", answerSchema);

module.exports.insertRecords = async records => {
  try {
    let rec = records.map(record => {
      return { ...record, _id: new mongoose.Types.ObjectId() };
    });

    let res = await Answer.insertMany(rec);
  } catch (error) {
    console.error(error);
  }
};

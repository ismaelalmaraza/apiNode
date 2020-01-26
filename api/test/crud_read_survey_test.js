const assert = require("assert");
const rp = require("request-promise");
const { newSurvey, SurveyNoSurveyName } = require("./payload_mock");

/* eslint-disable no-undef */
process.env.NODE_ENV = "test";
// process.env.NODE_CONFIG_DIR = './data/config/';
const config = require("config");

global.config = config.global;

const Survey = require("../models/survey");

describe("CRUD get Survey", () => {
  it("get a survey empty", done => {
    // const { surveyId } = survetTest.survey;
    // console.log("···········");
    rp("http://localhost:3000/1").then(res => {
      res = JSON.parse(res);
      const { code, response } = res;
      assert.equal(code, 201);
      assert.equal(response, "there are no surveys");
      done();
    });
  });

  let survetTest;
  beforeEach(done => {
    newSurvey.survey = JSON.stringify(newSurvey.survey);
    Survey.saveSurvey(newSurvey).then(Response => {
      assert.notEqual(Response, null);
      survetTest = Response;
      done();
    });
  });

  it("get all surveys empty", done => {
    rp("http://localhost:3000/").then(res => {
      const result = JSON.parse(res);
      const { response } = result;
      assert.equal(Array.isArray(response), true);
      done();
    });
  });

  it("get a survey", done => {
    const { surveyId } = survetTest.survey;
    rp(`http://localhost:3000/${surveyId}`).then(res => {
      res = JSON.parse(res);
      assert.equal(typeof res.response, "object");
      done();
    });
  });

  it("get all surveys", done => {
    rp("http://localhost:3000/").then(res => {
      const result = JSON.parse(res);
      // eslint-disable-next-line no-prototype-builtins
      assert.equal(result.hasOwnProperty("response"), true);
      assert.equal(Array.isArray(result.response), true);
      // eslint-disable-next-line no-prototype-builtins
      assert.equal(result.response[0].hasOwnProperty("survey"), true);
      // eslint-disable-next-line no-prototype-builtins
      assert.equal(result.response[0].hasOwnProperty("surveyName"), true);
      // eslint-disable-next-line no-prototype-builtins
      assert.equal(result.response[0].hasOwnProperty("createdAt"), true);
      // eslint-disable-next-line no-prototype-builtins
      assert.equal(result.response[0].hasOwnProperty("updatedAt"), true);
      // eslint-disable-next-line no-prototype-builtins
      assert.equal(result.response[0].hasOwnProperty("surveyId"), true);
      done();
    });
  });
});

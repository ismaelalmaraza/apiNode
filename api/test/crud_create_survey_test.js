const assert = require('assert');
const rp = require('request-promise');
const { newSurvey, SurveyNoSurveyName } = require('./payload_mock');

const options = {
  method: 'POST',
  uri: 'http://localhost:3000/',

  json: true, // Automatically stringifies the body to JSON
};

describe('CRUD Store Surveys', () => {
  it('store a survey', (done) => {
    options.body = newSurvey;
    rp(options).then((parsedBody) => {
      assert.equal(parsedBody.hasOwnProperty('response'), true);
      assert.equal(parsedBody.response.hasOwnProperty('survey'), true);
      assert.equal(parsedBody.response.hasOwnProperty('surveyName'), true);
      assert.equal(parsedBody.response.hasOwnProperty('createdAt'), true);

      assert.equal(parsedBody.response.hasOwnProperty('updatedAt'), true);
      assert.equal(parsedBody.response.hasOwnProperty('surveyId'), true);
      done();
    });
  });

  it('fail store a survey', (done) => {
    options.body = SurveyNoSurveyName;
    rp(options)
      .then(() => {})
      .catch((error) => {
        const [errorSurveyName] = error.error.errors;
        assert.equal(error.hasOwnProperty('error'), true);
        assert.equal(error.error.hasOwnProperty('errors'), true);
        assert.equal(error.statusCode, 422);
        assert.equal(errorSurveyName.param, 'surveyName');
        assert.equal(errorSurveyName.location, 'body');
        assert.equal(errorSurveyName.msg, 'Invalid value');
        done();
      });
  });
});

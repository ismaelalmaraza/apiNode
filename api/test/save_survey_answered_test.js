const assert = require('assert');
const { saveSurveyAnswered } = require('../models/surveyAnswered');
const { mockPayloadSurveyAnswered } = require('./payload_mock');

function hasProperty(obj, property) {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

describe('save surveys answered', () => {
  it('save a survey asnwered', (done) => {
    const queryConfiguration = {
      mockPayloadSurveyAnswered,
    };
    saveSurveyAnswered(queryConfiguration).then((response) => {
      assert.equal(hasProperty(response, 'save'), true);
      assert.equal(hasProperty(response, 'surveyAnswId'), true);
      assert.equal(hasProperty(response, 'surveyAnwed'), true);
      const { surveyAnwed } = response;
      assert.equal(typeof surveyAnwed, 'object');
      done();
    });
  });
});

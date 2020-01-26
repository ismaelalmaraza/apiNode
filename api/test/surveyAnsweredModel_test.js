/* eslint-disable no-undef */
const { assert } = require('chai');
// const { saveSurveyAnswered } = require('../controller/surveyAnsweredController');
const { saveSurvey, findSurvey } = require('../models/survey');
const { saveSurveyAnswered, findRelations } = require('../models/surveyAnswered');
const { example } = require('./payload_mock');

describe('Save polls answered', () => {
  let surveyTest;
  beforeEach((done) => {
    example.survey = JSON.stringify(example.survey);
    saveSurvey(example).then((Response) => {
      assert.notEqual(Response, null);
      surveyTest = Response;
      done();
    });
  });

  it('the data sent is deserialized and treated to be stored', (done) => {
    const { survey } = surveyTest;
    const { surveyId } = survey;
    const queryConfiguration = {
      query: { surveyId },
    };

    (async function f() {
      const request = {
        userId: 'TfsdfOfdsfsaKfsdfsadE123221N',
        appId: 15,
        latitud: 'x',
        longitud: 'y',
        questionId: 8,
        type: 'checkbox',
        answer: 'answer',
        transactionId: 'fsdfsd2545',
      };

      const response = await findSurvey(queryConfiguration);
      request.surveyId = response.surveyId;
      // eslint-disable-next-line no-underscore-dangle
      request.survey = response._id;

      const sAnwered = await saveSurveyAnswered(request);
      assert.typeOf(sAnwered, 'object');
      assert.isTrue(sAnwered.save);
      assert.includeMembers(Object.keys(sAnwered), ['save', 'surveyAnswId', 'surveyAnwed']);
      const result = await findRelations({ surveyAnswId: sAnwered.surveyAnswId });
      assert.isObject(result);
      assert.isNotTrue(result.isNew, 'should be false !!!');
      done();
    }());
  });
});

// {
//     "question2": "item1",
//     "question3": [
//         "item1",
//         "item2"
//     ],
//     "question4": "item2",
//     "question5": "xxxxxxxxxxxxxxxxxxxxxxxx",
//     "question6": [
//         "item1",
//         "item2"
//     ],
//     "question7": "item3",
//     "question8": "item3",
//     "question10": 3
// }

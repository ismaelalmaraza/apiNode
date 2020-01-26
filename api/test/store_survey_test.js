const assert = require('assert');
const Survey = require('../models/survey');

// eslint-disable-next-line no-undef
describe('Creating Surveys', () => {
  it('creates a survey', (done) => {
    newSurvey.survey = JSON.stringify(newSurvey.survey);
    Survey.saveSurvey(newSurvey).then((Response) => {
      assert.notEqual(Response, null);
      done();
    });
  });
});

const newSurvey = {
  survey: {
    pages: [
      {
        name: 'formulario',
        elements: [
          {
            type: 'radiogroup',
            name: 'question2',
            choices: ['item1', 'item2', 'item3'],
          },
          {
            type: 'checkbox',
            name: 'question3',
            choices: ['item1', 'item2', 'item3'],
          },
          {
            type: 'dropdown',
            name: 'question4',
            choices: ['item1', 'item2', 'item3'],
          },
          {
            type: 'text',
            name: 'question1',
          },
          {
            type: 'text',
            name: 'question5',
          },
          {
            type: 'checkbox',
            name: 'question6',
            choices: ['item1', 'item2', 'item3'],
          },
          {
            type: 'radiogroup',
            name: 'question7',
            choices: ['item1', 'item2', 'item3'],
          },
          {
            type: 'dropdown',
            name: 'question8',
            choices: ['item1', 'item2', 'item3'],
          },
          {
            type: 'comment',
            name: 'question9',
          },
          {
            type: 'rating',
            name: 'question10',
          },
        ],
      },
    ],
  },
  surveyName: 'ventas',
};

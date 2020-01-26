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
  groups: ['ventas', 'otros'],
};

const SurveyWithName = {
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
  surveyName: 'survey with elements and name',
  groups: ['ventas', 'otros'],
};

const SurveyNoSurveyName = {
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
  groups: ['ventas', 'otros'],
};

const example = {
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
  surveyName: 'DiazM',
  groups: ['ventas', 'otros'],
};

const mockPayloadSurveyAnswered = {
  userId: 1,
  surveyId: 1,
  answeredDate: '2019-05-01',
  appId: 50,
  latitude: 'latitud',
  longitud: 'longitud',
  questionId: 10,
  answer: 'fdsjfkdsjfksdjflkjdskfljdsklfj',
};

module.exports = {
  newSurvey,
  SurveyNoSurveyName,
  example,
  SurveyWithName,
  mockPayloadSurveyAnswered,
};

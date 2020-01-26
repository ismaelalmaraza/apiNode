const { assert } = require('chai');
const { Client } = require('node-rest-client');

const mongoose = require('mongoose');
const surveyAnswed = require('../models/surveyAnswered');

const SurveyAnswered = mongoose.model('SurveyAnswered');

const client = new Client();
const newAnswer = {
  surveyId: 7,
  metadata: {
    userId: 'TfsdfOfdsfsaKfsdfsadE123221N',
    appId: 15,
    latitud: 'x',
    longitud: 'y',
  },
  response: [
    { type: 'text', id: 'pregunta1', answer: 'chevere' },
    { type: 'checkbox', id: 'pregunta2', answer: [1, 2, 3, 4] },
    { type: 'radiogroup', id: 'pregunta3', answer: [8, 5, 4, 3] },
    { type: 'dropdown', id: 'pregunta4', answer: 1 },
    { type: 'comment', id: 'pregunta5', answer: 'aaaaaaaaaaaaaaa' },
    { type: 'rating', id: 'pregunta6', answer: 6 },
    { type: 'imagepicker', id: 'pregunta7', answer: '' },
    { type: 'boolean', id: 'pregunta8', answer: false },
    { type: 'html', id: 'pregunta9', answer: '' },
    { type: 'expression', id: 'pregunta10', answer: '' },
    { type: 'file', id: 'pregunta11', answer: '' },
    { type: 'matrix', id: 'pregunta12', answer: '' },
    { type: 'matrixdropdown', id: 'pregunta13', answer: [] },
    { type: 'matrixdynamic', id: 'pregunta14', answer: [] },
    { type: 'multipletext', id: 'pregunta15', answer: '' },
    { type: 'panel', id: 'pregunta16', answer: '' },
    { type: 'paneldynamic', id: 'pregunta17', answer: '' },
  ],
};

const args = {
  data: newAnswer,
  headers: { 'Content-Type': 'application/json' },
};

describe('CRUD APi answer', () => {
  it('check exist route', (done) => {
    client.post(`${global.config.test.baseUrlTest}/answer`, args, (data, response) => {
      assert.typeOf(data, 'object');
      assert.equal(response.statusCode, 200);
      assert.equal(response.statusMessage, 'OK');
      done();
    });
  });

  it('save a answer', (done) => {
    client.post(`${global.config.test.baseUrlTest}/answer`, args, (data, response) => {
      // response
      assert.isObject(response, 'object');
      assert.equal(response.statusCode, 200);
      // data
      assert.deepEqual(data, { response: 'Ok' });
      done();
    });
  });

  let newAnswerStore;
  beforeEach((done) => {
    client.post(`${global.config.test.baseUrlTest}/answer`, args, (data, response) => {
      newAnswerStore = data;
      done();
    });
  });

  let getAnswer;
  beforeEach((done) => {
    SurveyAnswered.find({})
      .sort({ _id: -1 })
      .limit(1)
      .exec((err, data) => {
        getAnswer = data;
        done();
      });
  });

  it('get answers', (done) => {
    client.get(`${global.config.test.baseUrlTest}/answer/list/all`, (data, response) => {
      // response
      assert.isObject(response, 'object');
      assert.equal(response.statusCode, 200);
      // data
      assert.equal(Array.isArray(data.response), true);
      done();
    });
  });

  it('get a answer', (done) => {
    const { surveyAnswId } = getAnswer[0];
    client.get(`${global.config.test.baseUrlTest}/answer/${surveyAnswId}`, (data, response) => {
      const DONT_REQUIRED = ['sha256Answer', 'answerName', 'delete'];
      const RESPONSE_KEY_OK = [
        'survey',
        'surveyId',
        'metadata',
        'answer',
        'createdAt',
        'updatedAt',
        'surveyAnswId',
      ];
      const keys = Object.keys(data.response[0]);
      assert.equal(response.statusCode, 200);
      // data
      let valid = true;
      for (let i = 0; i < keys.length; i += 1) {
        if (!RESPONSE_KEY_OK.includes(keys[i])) {
          valid = !!DONT_REQUIRED.includes(keys[i]);
          break;
        }
      }

      assert.isTrue(valid);
      done();
    });
  });

  it('update a answer with name', (done) => {
    const { surveyAnswId } = getAnswer[0];
    const answerName = 'TEST_NAME';
    client.put(
      `${global.config.test.baseUrlTest}/answer/${surveyAnswId}/${answerName}`,
      (data, response) => {
        // response
        assert.isObject(response, 'object');
        assert.equal(response.statusCode, 200);
        // data
        assert.deepEqual(data, { response: 'Ok' });
        done();
      },
    );
  });

  it('deleta a answer', (done) => {
    const { surveyAnswId } = getAnswer[0];
    client.delete(`${global.config.test.baseUrlTest}/answer/${surveyAnswId}`, (data, response) => {
      // response
      assert.isObject(response, 'object');
      assert.equal(response.statusCode, 200);
      // data
      assert.deepEqual(data, { response: 'Ok' });
      done();
    });
  });
});

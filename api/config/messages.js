module.exports = {
  surveyError: {
    storeError: {
      code: 401,
      method: '--- Store Survey ---',
      message: 'the parameters should not be empty',
      customError: true,
    },
    updateError: {
      code: 402,
      method: '--- Update Survey ---',
      message: 'the parameters should not be empty',
      customError: true,
    },
    invalidParameter: 'the parameter @ is not valid',
    isNotJson: 'the parameter @ should be a json',
    isNotString: 'the parameter @ should be a string',
  },
  answer: {
    // Responses
    405: '*** Save Answer ***',
    406: '*** Get Answers ***',
    407: '*** Get Answer ***',
    408: '*** Delete Answer ***',
    409: '*** Update Answer ***',
    // Ok
    200: 'Ok',
    201: 'There is no answer',
  },
  codes: {
    400: 'the parameter should be exist',
    401: 'the parameters should not be empty',
    402: 'the parameter should be json',
    403: 'the parameter should be string',
  },
};

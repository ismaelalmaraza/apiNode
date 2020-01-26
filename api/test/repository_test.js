const assert = require('assert');
const { isValid, isValidAndNotEmpty, isNumeric } = require('../services/repository');

describe('Evaluation of methods', () => {
  it('data is valid', () => {
    assert.equal(isValid(), false);
    assert.equal(isValid(null), false);
    assert.equal(isValid(''), true);
    assert.equal(isValid('aabbcc'), true);
    assert.equal(isValid(123), true);
    assert.equal(isValid({}), true);
    assert.equal(isValid([]), true);
    assert.equal(isValid(true), true);
    assert.equal(isValid(false), true);
  });

  it('data is valid and not empty string', () => {
    assert.equal(isValidAndNotEmpty(), false);
    assert.equal(isValidAndNotEmpty(null), false);
    assert.equal(isValidAndNotEmpty(''), false);
    assert.equal(isValidAndNotEmpty('aabbcc'), true);
    assert.equal(isValidAndNotEmpty(123), true);
    assert.equal(isValidAndNotEmpty({}), true);
    assert.equal(isValidAndNotEmpty([]), true);
    assert.equal(isValidAndNotEmpty(true), true);
    assert.equal(isValidAndNotEmpty(false), true);
  });

  it('is numeric', () => {
    assert.equal(isNumeric(), false);
    assert.equal(isNumeric(''), false);
    assert.equal(isNumeric('abcd'), false);
    assert.equal(isNumeric('5f45s1f5ds4f'), false);
    assert.equal(isNumeric({}), false);
    assert.equal(isNumeric([]), false);
    assert.equal(isNumeric(true), false);
    assert.equal(isNumeric(false), false);
    assert.equal(isNumeric(12345), true);
    assert.equal(isNumeric('12345'), true);
    assert.equal(isNumeric(123451215454205), true);
    assert.equal(isNumeric('234545122'), true);
  });
});

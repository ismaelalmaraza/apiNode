const crypto = require("crypto");
const {
  storeError,
  invalidParameter
} = require("../config/messages").surveyError;
const moment = require("moment");

function isValid(data) {
  return typeof data !== "undefined" && data !== null;
}

function isValidAndNotEmpty(data) {
  return typeof data !== "undefined" && data !== null && data !== "";
}

function clearResponse(data) {
  const response = JSON.parse(JSON.stringify(data));
  delete response._id;
  delete response.__v;

  return response;
}

function isJson(item) {
  let isValidJson = typeof item !== "string" ? JSON.stringify(item) : item;

  try {
    isValidJson = JSON.parse(isValidJson);
  } catch (e) {
    return false;
  }

  if (typeof isValidJson === "object" && isValidJson !== null) {
    return true;
  }

  return false;
}

function isNumeric(string) {
  return /^\d*$/.test(string) && string !== "" && !Array.isArray(string);
}

function check(args) {
  let valid = true;
  if (args.length === 0) {
    valid = -1;
  }
  if (args.length === 1) {
    valid = isValidAndNotEmpty(args[0]) ? true : { position: 0 };
  }
  if (args.length > 1) {
    valid = true;
    for (let i = 0; i < args.length; i += 1) {
      valid = isValidAndNotEmpty(args[i]) && true;
      if (!valid) {
        valid = { position: i };
        break;
      }
    }
    return valid;
  }
}

function hasOwnProperty(data, property) {
  return Object.prototype.hasOwnProperty.call(data, property);
}

function validation(request) {
  const validationResult = check(Object.values(request));
  if (hasOwnProperty(validationResult, "position")) {
    storeError.detail = invalidParameter.replace(
      "@",
      Object.keys(request)[validationResult.position]
    );
    storeError.request = request;
    throw storeError;
  }
}

function validationM(request) {
  const validationResult = check(Object.values(request));
  if (hasOwnProperty(validationResult, "position")) {
    storeError.detail = invalidParameter.replace(
      "@",
      Object.keys(request)[validationResult.position]
    );
    storeError.request = request;
    return storeError;
  }
  return true;
}

function isString(value) {
  return typeof value === "string";
}

function sha256(string) {
  const hash = crypto
    .createHash("sha256")
    .update(string)
    .digest("hex");
  return hash;
}

function validateDate(startDate, endDate) {
  let defaultDate = new Date("2019").getTime();

  const EMPTY_DATES = 0;
  const EXIST_AND_VALIDS_DATES = 1;
  if (!startDate || !endDate) {
    return EMPTY_DATES;
  }

  if (
    new Date(startDate).getTime() < defaultDate ||
    new Date(endDate).getTime() < defaultDate
  ) {
    return EMPTY_DATES;
  }

  if (
    !moment(endDate).isAfter(startDate) ||
    moment(startDate).isSame(endDate)
  ) {
    throw dispatchCustomError("Date Error", "The date range is invalid");
  } else {
    return EXIST_AND_VALIDS_DATES;
  }
}

function dispatchCustomError(nameError, messageError) {
  let error = new Error();
  error.name = nameError;
  error.message = messageError;

  return error;
}

// TODO: metodo para verificar firma

module.exports = {
  isValid,
  clearResponse,
  isJson,
  isNumeric,
  isValidAndNotEmpty,
  check,
  hasOwnProperty,
  validation,
  validationM,
  isString,
  sha256,
  validateDate
};

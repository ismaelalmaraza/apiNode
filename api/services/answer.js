const util = require("util");
class Answer {
  constructor() {}

  text(value) {
    return value.Answer;
  }
  comment(value) {
    return value.Answer;
  }
  checkbox(value) {
    // console.log("=== CHECKBOX ===");
    try {
      if (!value.Answer || !value.choices) {
        return "";
      }

      let answer = JSON.parse(value.Answer);

      let choices = value.choices;
      let newAnswer = [];
      choices.map(val => {
        if (answer.includes(val.value)) {
          newAnswer.push(val.text);
        }
      });

      return util.inspect(newAnswer);
    } catch (error) {
      return "No se pudo obtener la respuesta";
    }
  }
  radiogroup(value) {
    // console.log("=== RADIOGROUP ===");
    // console.log(value);

    try {
      if (!value.Answer || !value.choices) {
        return "";
      }

      let answer;
      try {
        answer = JSON.parse(value.Answer);
      } catch (error) {
        answer = value.Answer;
      }

      let choices = value.choices;

      let newAnswer = [];
      choices.map(val => {
        if (val.value === answer) {
          newAnswer.push(val.text);
        }
      });
      return newAnswer;
    } catch (error) {
      return "No se pudo obtener la respuesta";
    }
  }
  signaturepad(value) {
    // console.log("=== SIGNATUREPAD ===");
    return value.Answer ? "contiene firma" : "sin firma";
  }
  dropdown(value) {
    // console.log(value);
    try {
      if (!value.Answer || !value.choices) {
        return "";
      }

      let answer = JSON.parse(value.Answer);
      let choices = value.choices;

      let newAnswer = [];
      value.choices.forEach((val, index) => {
        if (val.value === answer) {
          newAnswer.push(val.text);
        }
      });

      return util.inspect(newAnswer);
    } catch (error) {
      // console.log(error);
      return "No se pudo obtener la respuesta";
    }
  }
  rating(value) {
    return value.Answer;
  }
  multipletext(value) {
    // console.log("=== MULTIPLE TEXT ===");
    try {
      if (!value.Answer) {
        return "";
      }

      let answer = JSON.parse(value.Answer);
      let newAnswer = {};
      answer.map(val => {
        newAnswer[val.name] = val.Answer;
      });

      return util.inspect(newAnswer);
    } catch (error) {
      return "No se pudo obtener la respuesta";
    }
  }
  matrix(value) {
    try {
      // console.log("=== MATRIX ===");
      if (!value.Answer || !value.columns) {
        return "";
      }
      let answers = JSON.parse(value.Answer);

      for (let answer in answers) {
        let k = value.columns.find(obj => {
          return answers[answer] === obj.value;
        });

        answers[answer] = k.text;
      }

      return util.inspect(answers);
    } catch (error) {
      return "No se pudo obtener la respuesta";
    }
  }
  boolean(value) {
    try {
      if (value.hasOwnProperty("evidence")) {
        if (value.Answer) {
          return value.Answer.length > 100 ? "Con evidencia" : value.Answer;
        } else {
          return "Sin evidencia";
        }
      }
    } catch (error) {
      // console.log(error);
      return "No se pudo obtener la respuesta";
    }
  }

  imagepicker(value) {
    try {
      if (value.Answer.length > 100) {
        return "Contiene imagenes";
      } else {
        return value.Answer;
      }
    } catch (error) {
      return "No se pudo obtener la respuesta";
    }
  }

  valid(data) {
    return typeof data !== "undefined" && data !== null;
  }
}

module.exports = Answer;

const util = require("util");
const logger = require("../services/loggerWinston");

class Clear {
    constructor() {}

    text(value) {
        // console.log(value.Answer ? value.Answer : "");
        return value.Answer ? value.Answer : "";
    }
    comment(value) {
        return value.Answer ? value.Answer : "";
    }
    checkbox(value) {
        // console.log("=== CHECKBOX ===");
        try {
            if (!value.Answer || !value.choices) {
                return "";
            }

            let answer =
                typeof value.Answer === "string" ?
                JSON.parse(value.Answer) :
                value.Answer;

            let choices = value.choices;
            let newAnswer = [];
            choices.map(val => {
                if (answer.includes(val.value)) {
                    newAnswer.push(val.text);
                }
            });

            if (value.hasOther && newAnswer.length === 0) {
                newAnswer = answer;
            }

            return util.inspect(newAnswer.join(","));
        } catch (error) {
            // console.log(error);
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
                answer =
                    typeof value.Answer === "string" ?
                    JSON.parse(value.Answer) :
                    value.Answer;
            } catch (error) {
                answer = value.Answer;
            }

            if (typeof answer === "boolean") {
                answer = answer.toString();
            }

            let choices = value.choices;
            let newAnswer = [];
            choices.map(val => {
                if (val.value === answer) {
                    newAnswer.push(val.text);
                }
            });

            if (value.hasOther && newAnswer.length === 0) {
                newAnswer = answer;
            }

            return util.inspect(
                Array.isArray(newAnswer) ? newAnswer.join(",") : newAnswer
            );
        } catch (error) {
            return "No se pudo obtener la respuesta";
        }
    }
    signaturepad(value) {
        // console.log("=== SIGNATUREPAD ===");
        return value.Answer ? "Contiene firma" : "";
    }
    dropdown(value) {
        try {
            if (!value.Answer || !value.choices) {
                return "";
            }

            let answer =
                typeof value.Answer === "string" ?
                JSON.parse(value.Answer) :
                value.Answer;
            let choices = value.choices;

            let newAnswer = [];
            value.choices.forEach((val, index) => {
                if (val.value === answer) {
                    newAnswer.push(val.text);
                }
            });

            if (value.hasOther && newAnswer.length === 0) {
                newAnswer = answer;
            }

            return util.inspect(
                Array.isArray(newAnswer) ? newAnswer.join(",") : newAnswer
            );
        } catch (error) {
            return "No se pudo obtener la respuesta";
        }
    }
    rating(value) {
        return value.Answer ? value.Answer : "";
    }
    multipletext(value) {
        // console.log("=== MULTIPLE TEXT ===");
        try {
            if (!value.Answer) {
                return "";
            }

            let answer =
                typeof value.Answer === "string" ?
                JSON.parse(value.Answer) :
                value.Answer;
            let items = value.items;
            let newAnswer = {};
            answer.map(val => {
                newAnswer[val.name] = val.Answer;
            });

            let response = {};
            items.forEach(item => {
                response[item.title] = newAnswer[item.name];
            });

            return util.inspect(response);
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
            let answers =
                typeof value.Answer === "string" ?
                JSON.parse(value.Answer) :
                value.Answer;
            let rows = value.rows;
            let keys = Object.keys(answers);

            let response = {};
            for (let answer in answers) {
                let k = value.columns.find(obj => {
                    return answers[answer] === obj.value;
                });

                let v = value.rows.find(obj => {
                    return answer === obj.value;
                });

                response[v.text] =
                    k && k.hasOwnProperty("text") && k.text ? k.text : null;
            }

            return util.inspect(response);
        } catch (error) {
            console.log(error);
            return "No se pudo obtener la respuesta";
        }
    }

    boolean(value) {
        try {
            if (!value.Answer) return "";
            if (value.hasOwnProperty("evidence")) {
                if (value.Answer.length > 1000 && typeof value.Answer === "string") {
                    return "Contiene evidencia";
                } else {
                    let obj;
                    try {
                        obj =
                            typeof value.Answer === "string" ?
                            JSON.parse(value.Answer) :
                            value.Answer;
                    } catch (error) {
                        obj = value.Answer;
                    }

                    let urls = [];
                    let qa = `https://api.com/qa/common/survey/media/storage/evidence/${
            value.surveyId
          }/${value.answerId}`;

                    let prd = `https://api.com/common/survey/media/storage/evidence/${
            value.surveyId
          }/${value.answerId}`;
                    let isQA = false;

                    if (Array.isArray(obj)) {
                        obj.forEach(a => {
                            // console.log(a);
                            let url = a.indexOf("QA") > 0 ? `${qa}/${a}` : `${prd}/${a}`;
                            isQA = a.indexOf("QA") > 0 ? true : false;
                            urls.push(url);
                        });
                    } else {
                        qa = "";
                    }

                    return isQA ? qa : prd;
                }
            }
        } catch (error) {
            console.log(error);
            logger.error("Error", { error });
            return "No se pudo obtener la respuesta";
        }
    }

    imagepicker(value) {
        try {
            if (!value.Answer) return "";
            // base64
            if (value.Answer.length > 5000) {
                return "Contiene imagenes";
            } else {
                let obj =
                    typeof value.Answer === "string" ?
                    JSON.parse(value.Answer) :
                    value.Answer;
                let urls = [];
                let qa = `https://api.com/qa/common/survey/media/storage/${
          value.surveyId
        }/${value.answerId}`;
                let prd = `https://api.com/common/survey/media/storage/${
          value.surveyId
        }/${value.answerId}`;
                let isQA = false;
                obj.forEach(a => {
                    let url = a.indexOf("QA") > 0 ? `${qa}/${a}` : `${prd}/${a}`;
                    isQA = a.indexOf("QA") > 0 ? true : false;
                    urls.push(url);
                });

                return isQA ? qa : prd;

                // return urls.join(", ");
            }
        } catch (error) {
            console.log(error);
            return "No se pudo obtener la respuesta";
        }
        return "";
    }

    valid(data) {
        return typeof data !== "undefined" && data !== null;
    }
}

module.exports = Clear;
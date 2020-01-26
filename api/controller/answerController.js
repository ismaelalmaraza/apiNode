const fs = require("fs");
const path = require("path");
const { findSurvey } = require("../models/survey");
const {
    save,
    answersQuery,
    queryCommand
} = require("../models/surveyAnswered");
const { sha256 } = require("../services/repository");
const logger = require("../services/loggerWinston");
const { answer } = require("../config/messages");
const { customPopulate, populate } = require("../models/survey");
const SurveyAnswered = require("../models/surveyAnswered").SurveyAnwed;
const Answer = require("../services/answer");
const moment = require("moment");
const axios = require("axios");

async function error(err, req, res) {
    logger.error(answer[req.method], { err: err.stack });
    res.status(req.method).json({
        error: err.stack,
        transactionId: req.transactionId
    });
}

async function saveAnswer(req, res) {
    try {
        const request = {
            id: req.body._id,
            userId: req.body.userId,
            response: req.body.response,
            metadata: req.body.metadata,
            information: req.body.information,
            transactionId: req.transactionId
        };

        request.survey = request.id;
        request.answer = request.response;

        const result = await save(request);

        let response;
        if (result) {
            response = answer[200];
        } else {
            response = answer[201];
        }
        res.status(200).json({
            response
        });
    } catch (e) {
        req.method = 405;
        error(e, req, res);
    }
}

async function getAnswers(req, res) {
    try {
        const query = {};
        const result = await populate(query);

        res.status(200).json({
            response: result,
            count: Array.isArray(result) ? result.length : []
        });
    } catch (e) {
        req.method = 406;
        error(e, req, res);
    }
}

async function getAnswer(req, res) {
    try {
        const query = { _id: req.params.id };
        const result = await populate(query);
        let response;
        if (result) {
            response = result;
        } else {
            response = answer[201];
        }
        res.status(200).json({
            response
        });
    } catch (e) {
        req.method = 407;
        error(e, req, res);
    }
}

async function deleteAnswer(req, res) {
    try {
        const query = { surveyAnswId: req.params.id };
        const command = { $set: { delete: true } };
        const result = await queryCommand(query, command, { new: true });

        let response;
        if (result) {
            response = answer[200];
        } else {
            response = answer[201];
        }
        res.status(200).json({
            response
        });
    } catch (e) {
        req.method = 408;
        error(e, req, res);
    }
}

async function updateAnswer(req, res) {
    try {
        const request = {
            surveyAnswId: req.params.id,
            answerName: req.params.answerName,
            transactionId: req.transactionId
        };

        const query = { surveyAnswId: request.surveyAnswId };
        const command = { $set: { answerName: request.answerName } };
        const result = await queryCommand(query, command, { new: true });
        let response;
        if (result) {
            response = answer[200];
        } else {
            response = answer[201];
        }
        res.status(200).json({
            response
        });
    } catch (e) {
        req.method = 409;
        error(e, req, res);
    }
}

async function getReport(req, res) {
    // console.log("REPORTE");
    try {
        const request = {
            id: req.params.id,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            userId: req.body.userId
        };

        const query = {
            $and: [
                { updatedAt: { $gte: request.startDate } },
                { updatedAt: { $lte: request.endDate } },
                { _id: request.id }
            ]
        };

        const result = await customPopulate(query, request.userId);
        if (!result.length) {
            return res.status(400).json({
                response: []
            });
        }

        const survey = JSON.parse(result[0].survey);

        let answers = result[0]["surveyAnswered"];

        let surveyName = survey.title;

        if (!answers.length) {
            return res.status(400).json({
                response: []
            });
        }

        let clear = [];
        let other = [];
        let users = [];
        let dates = [];

        answers.map(data => {
            dates.push(data.updatedAt ? data.updatedAt : "");
            users.push(data.userId ? data.userId : "");

            try {
                let res = JSON.parse(data.answer);

                if (res instanceof Object) {
                    clear.push(...res);
                } else {
                    clear.push(
                        ...JSON.parse(Buffer.from(data.answer, "base64").toString("ascii"))
                    );
                }
            } catch (error) {
                clear.push(
                    ...JSON.parse(Buffer.from(data.answer, "base64").toString("ascii"))
                );
            }
        });

        try {
            survey.pages.map(data => {
                other.push(...data.questions);
            });
        } catch (error) {
            return res.status(412).json({
                response: "Fail generate report"
            });
        }

        let i = 0;
        let l = other.length - 1;
        var m = 0;
        var k = 0;
        var banHeaders = true;
        // creation file
        const fileName = `${new Date().toISOString()}_survey.csv`;

        let filePath = path.resolve("./services/temp", fileName);
        const showAnswer = new Answer();

        let headers = ["Encuesta", "Fecha", "Hora", "Usuario"];

        let band = true;
        let info = [];
        while (i <= clear.length - 1) {
            let union = Object.assign(other[m], clear[i]);
            // final.push(union);

            if (band) {
                info.push(
                    surveyName,
                    dates[k] ? moment(dates[k]).format("DD-MM-YYYY") : "",
                    dates[k] ? moment(dates[k]).format("HH:mm:ss") : "",
                    users[k] ? users[k] : ""
                );
                band = false;
            }

            let geo = getLocation(union);
            // console.log(typeof geo);
            // console.log(geo);
            // console.log(geo.Latitude);

            info.push([
                // union.title ? union.title : "Evidencia",
                JSON.stringify(showAnswer[union.Type](union) + ""),
                geo.Latitude ? geo.Latitude : "",
                geo.Longitude ? geo.Longitude : "",
                geo.Altitude ? geo.Altitude : ""
            ]);

            headers.push([
                Buffer.from(union.title ? union.title : "Evidencia").toString("utf8"),
                // "Respuesta",
                "Latitud",
                "Longitud",
                "Altitud"
            ]);

            if (m === l) {
                if (banHeaders) {
                    fs.appendFileSync(filePath, headers + "\n", "utf8");
                    banHeaders = false;
                }
                fs.appendFileSync(filePath, info + "\n", "utf8");

                band = true;
                info = [];
                k++;
            }

            m === l ? (m = 0) : m++;
            i++;
        }

        res.header("Access-Control-Allow-Origin", "*");
        fs.readFile(filePath, "utf8", function(err, data) {
            if (err) throw err;
            res.download(filePath, fileName, function(e) {
                if (e) {
                    throw e;
                } else {
                    fs.unlinkSync(filePath);
                }
            });
        });
    } catch (e) {
        req.method = 411;
        error(e, req, res);
    }
}

function getLocation(answer) {
    if (answer.hasOwnProperty("QuestionLocation") && answer.QuestionLocation) {
        delete answer.QuestionLocation.QuestionId;

        return answer.QuestionLocation;
    }
    return {};
}

async function getMedia(req, res) {
    try {
        const urlBase = `${req.protocol}://${req.get("host")}`;
        let fileName = req.url.split("/");
        let newFileName = fileName[fileName.length - 1];

        // delete ''
        fileName.shift();
        // delete 'media'
        fileName.shift();

        fileName = fileName.join("/");

        axios
            .post(
                "https://api.azure-api.net/common/services/storage/read", {
                    name: fileName
                }, {
                    responseType: "arraybuffer",
                    headers: {
                        "Ocp-Apim-Subscription-Key": "ce6ea6fd86b54ee8915e01a6e3494e94"
                    }
                }
            )
            .then(resp => {
                logger.info("get file on storage");
                var base64 = Buffer.from(resp.data, "binary").toString("base64");
                res.render("media.html", { name: base64 });
            })
            .catch(error => {
                logger.error("empty media: ", error);
                res.render("media.html", {
                    error: "Ocurrio un error intentelo mas tarde"
                });
            });
    } catch (error) {
        console.error(error);
        logger.error("empty media", error);
        res.render("media.html", {
            error: "Ocurrio un error intentelo mas tarde"
        });
    }
}

async function downloadMedia(req, res) {
    try {
        let { fileName } = req.params;
        let filePath = path.resolve("./services/temp", fileName);

        if (fs.existsSync(filePath)) {
            res.download(filePath, fileName, function(e) {
                if (e) {
                    throw e;
                } else {
                    fs.unlinkSync(filePath);
                }
            });
        } else {
            res.status(200).json({});
        }
    } catch (error) {
        console.error(error);
        res
            .status(200)
            .json({ response: false, message: "Couldn't get the answer" });
    }
}

async function countAnswersByClient(req, res) {
    const mongoose = require("mongoose");
    try {
        let response = await SurveyAnswered.aggregate([{
                $match: {
                    survey: mongoose.Types.ObjectId(req.body.surveyId),
                    "information.clientId": { $exists: true },
                    "information.clientId": req.body.clientId
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                    countAnswer: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({
            response
        });
    } catch (error) {
        return res.status(200).json({
            error: error.stack
        });
    }
}

module.exports = {
    saveAnswer,
    getAnswers,
    getAnswer,
    deleteAnswer,
    updateAnswer,
    getReport,
    getMedia,
    downloadMedia,
    countAnswersByClient
};
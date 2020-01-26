const Answer = require("../models/surveyAnswered.js");
const SurveyAnwed = require("../models/surveyAnswered").SurveyAnwed;
const Survey = require("../models/survey");
const axios = require("axios");
const parallel = require("async").parallel;
const logger = require("../services/loggerWinston");
const mongoose = require("mongoose");

module.exports.getMedia = async(req, res) => {
    logger.info(" === start show images by survey === ");
    let media = {
        survey: req.params.surveyId,
        _id: req.params.answerId
    };

    let record = await Answer.populateOnlyFields(media);
    let { answer } = record[0];
    answer = typeof answer === "string" ? JSON.parse(answer) : answer;

    let images = [];
    let question;
    answer.forEach(element => {
        if (element.Type === "imagepicker" && element.Answer) {
            images = images.concat(JSON.parse(element.Answer));
            question = element;
        }
    });

    imagesArrayFunctions = [];
    if (Array.isArray(images) && images.length > 0) {
        images.forEach(image => {
            imagesArrayFunctions.push(function(callback) {
                axios
                    .post(
                        "https://api.azure-api.net/common/services/storage/read", {
                            name: image
                        }, {
                            responseType: "arraybuffer",
                            headers: {
                                "Ocp-Apim-Subscription-Key": "ce6ea6fd86b54ee8915e01a6e3494e94"
                            }
                        }
                    )
                    .then(resp => {
                        logger.info("image succes", { fileName: image });
                        var base64 = Buffer.from(resp.data, "binary").toString("base64");
                        callback(null, base64);
                    })
                    .catch(error => {
                        logger.error(
                            "Error: read images type imagepicker [show images]",
                            error
                        );
                        res.render("storage.html", {
                            error: "Ocurrio un error intentelo mas tarde"
                        });
                        callback(error, null);
                    });
            });
        });
    }

    parallel(imagesArrayFunctions, function(error, results) {
        if (!error) {
            if (results.length > 0) {
                res.render("storage.html", { results, question });
            } else {
                res.render("storage.html", { message: "No se encontrarón resultados" });
            }
        }
    });
};

module.exports.getEvidence = async(req, res) => {
    logger.info(" === get evidence === ");
    let query = {
        survey: req.params.surveyId,
        _id: mongoose.Types.ObjectId(req.params.answerId) // -> surveyAnswered _id model
    };

    let record = await SurveyAnwed.find(query);
    let { answer } = record[0];
    let { Answer } = answer[0];
    let evidences = typeof Answer === "string" ? JSON.parse(Answer) : Answer;

    let media = [];
    answer.forEach(ans => {
        if (ans.Type === "boolean" && ans.Answer) {
            media = media.concat(JSON.parse(ans.Answer));
        }
    });

    // get evidences parallel
    let arrayFunctions = [];
    if (Array.isArray(media)) {
        media.forEach(evidence => {
            arrayFunctions.push(function(callback) {
                axios
                    .post(
                        "https://api.azure-api.net/common/services/storage/read", {
                            name: evidence
                        }, {
                            responseType: "arraybuffer",
                            headers: {
                                "Ocp-Apim-Subscription-Key": "ce6ea6fd86b54ee8915e01a6e3494e94"
                            }
                        }
                    )
                    .then(resp => {
                        logger.info("evidence success", { fileName: evidence });
                        var base64 = Buffer.from(resp.data, "binary").toString("base64");
                        callback(null, { base64, ext: evidence.split(".").pop() });
                    })
                    .catch(error => {
                        logger.error("Error: read evidence [show evidence]", error);

                        callback(error, null);
                    });
            });
        });
    }

    parallel(arrayFunctions, function(err, results) {
        if (!err) {
            let audio = [];
            let imagen = [];

            results.forEach(result => {
                if (result.hasOwnProperty("ext") && result.ext === "mp4") {
                    audio.push(result);
                } else {
                    imagen.push(result);
                }
            });

            // return res.render("evidence.html", { results: imagen, audio });
            return res.status(200).json({
                response: {
                    imagen,
                    audio
                }
            });
        } else {
            console.error(err);
            return res.status(200).json({
                error: err.stack,
                response: {}
            });
            // res.render("evidence.html", { message: "No se encontrarón resultados" });
        }
    });
};
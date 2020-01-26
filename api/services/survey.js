const uuidv4 = require("uuid/v4");
const fs = require("fs");
const request = require("request");
const logger = require("../services/loggerWinston");

class Survey {
    constructor(survey) {
        this.survey = survey;
    }

    // get fields
    clearRequest(surveyToString = false) {
        let request = {};
        for (let key in this.survey) {
            if (this.survey.hasOwnProperty(key)) {
                if (
                    typeof this.survey[key] !== "undefined" &&
                    this.survey[key] !== null
                ) {
                    request[key] =
                        surveyToString && key === "survey" ?
                        JSON.stringify(this.survey[key]) :
                        this.survey[key];
                }
            }
        }

        return request;
    }

    getImagePicker(surveyId) {
        let data = {...this.survey };
        // console.log(data);
        let { survey } = data;
        survey = typeof survey === "string" ? JSON.parse(survey) : survey;
        let { pages } = survey;

        pages.forEach(page => {
            if (Array.isArray(page.questions)) {
                page.questions.forEach(question => {
                    if (
                        question.hasOwnProperty("type") &&
                        question.type &&
                        question.type === "imagepicker"
                    ) {
                        let env = question.env ? "/" : "/QA/";

                        if (Array.isArray(question.choices)) {
                            question.choices.forEach(choice => {
                                if (choice instanceof Object) {
                                    let val = choice.imageLink;
                                    let isLink = val.search(/http|https/) >= 0 ? true : false;
                                    let isLinkToStorage =
                                        val.search(/s_Survey/) >= 0 ? true : false;
                                    let replaceString;
                                    if (!isLink && !isLinkToStorage) {
                                        // base64
                                        let base64Ext = val
                                            .split(",")[0]
                                            .split("/")[1]
                                            .split(";")[0];

                                        replaceString = `s_Survey${env}Evidence/${surveyId}/${uuidv4()}.${base64Ext}`;
                                        this.saveMedia(replaceString, val.split(",")[1]);
                                    } else {
                                        replaceString = val;
                                    }
                                    choice.imageLink = replaceString;
                                }
                            });
                        }
                    }
                });
            }
        });
        survey.pages = pages;
        data.survey = JSON.stringify(survey);

        return data;
    }

    saveMedia(fileName, body) {
        logger.info("save media on storage", { fileName: fileName });
        request({
                method: "POST",
                url: "https://-api.azure-api.net/common/services/storage/write",
                body: {
                    name: fileName,
                    data: body
                },
                json: true,
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": "5abdf225087343e28e37dbbfa13f74f6"
                }
            },
            function(error, response, body) {
                if (error) {
                    logger.error("save media error: ", { error: error });
                } else {
                    logger.info("save image success");
                }
            }
        );
    }

    clearRequestUpdate(surveyToString = false) {
        let request = {};
        for (let key in this.survey) {
            if (this.survey.hasOwnProperty(key)) {
                if (
                    typeof this.survey[key] !== "undefined" &&
                    this.survey[key] !== null
                ) {
                    !request.hasOwnProperty("$set") ? (request.$set = {}) : "";

                    request["$set"][key] =
                        surveyToString && key === "survey" ?
                        JSON.stringify(this.survey[key]) :
                        this.survey[key];
                } else {
                    !request.hasOwnProperty("$unset") ? (request.$unset = {}) : "";
                    request["$unset"][key] = "";

                    // default value "required" should be exists
                    if (key === "required" && typeof this.survey[key] === "undefined") {
                        delete request["$unset"]["required"];
                        request["$set"][key] = false;
                    }
                }
            }
        }

        return request;
    }
}

module.exports = Survey;
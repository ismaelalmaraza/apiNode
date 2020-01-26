// time
const moment = require("moment-timezone");

moment.tz.setDefault("America/Monterrey");

// const path = require('path');
// config entry point
// process.env.NODE_CONFIG_DIR = path.join(__dirname, '/data/config');

const config = require("config");

// Assignment to the global object
global.config = config.global;

const express = require("express");
const cors = require("cors");

const app = express();
// app.use("/static", express.static(__dirname + "/public"));

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "150mb" }));
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));
require("mongoose");
require("./services/remote");
const survey = require("./routes/survey");
const answer = require("./routes/answer");
const logs = require("./routes/logs");
const media = require("./routes/media");
const { auth, checkConnection, addReqId } = require("./routes/middleware");

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
const mustacheExpress = require("mustache-express");

app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", `${__dirname}/views`);
// app.use("/static", express.static(__dirname + "./public"));
// app.use(express.static("public"));

app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.use(auth);
app.use(addReqId);
// app.use(checkConnection);
app.use("/", survey);
app.use("/answer", answer);
app.use("/logs", logs);
app.use("/media", media);
app.listen(port, function() {
    console.log(" Survey ready in port " + port);
});

// test local
// app.listen(port, function () {
//     console.log("Server listen on port 3000");
// });
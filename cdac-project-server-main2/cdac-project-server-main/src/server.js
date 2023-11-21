const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mainRouter = require("./router/router")
var logger = require("morgan");
var cookieParser = require("cookie-parser");
require("./shared/database"); // database make connection

const app = express();
const PORT = 3000;

app.use(logger("dev"));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", mainRouter);

app.listen(PORT, (err) => {
  if (err) console.log("Error : ", err);
  else console.log(`Server is running on port: ${PORT}`);
});

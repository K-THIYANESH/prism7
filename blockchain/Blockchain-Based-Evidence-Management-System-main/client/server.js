var express = require('express');
var app = express();

const cors = require("cors");
app.use(cors());

app.use(express.static(__dirname + '/'));

app.listen(process.env.PORT || 8080);
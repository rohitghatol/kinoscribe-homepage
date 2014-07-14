// web.js
var express = require("express");
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.static(__dirname + '/public'));


var port = Number(process.env.PORT || 8080);
app.listen(port, function() {
  console.log("Listening on " + port);
});

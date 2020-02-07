const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const flash = require("express-flash");
const request = require("request");
const app = express();
const Key = require("./key");
app.use(express.static("client/static"));
app.use(bodyParser.json());
app.use(express.json());

app.use(
  session({
    secret: Key.Secret,
    resave: true,
    saveUninitialized: true
  })
);

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

var station = "req.query.Station;";
var Mykey = Key.key;
var cmd = "etd";
var Tempkey = Key.tempKey;
var destination = "19th";

app.get("/", function(req, res) {
  request(
    "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" +
      destination +
      "&dir=n&key=" +
      Mykey +
      "&json=y",
    function(error, response, north) {
      console.error("North error:", error);
      request(
        "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" +
          destination +
          "&dir=s&key=" +
          Mykey +
          "&json=y",
        function(error, response, south) {
          console.error("South error:", error);
          res.render("ninteenth.ejs", {
            South: JSON.parse(south),
            North: JSON.parse(north)
          });
        }
      );
    }
  );
});

app.get("/:station", function(req, res, next) {
  (destination = req.params.station),
    request(
      "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" +
        destination +
        "&dir=n&key=" +
        Mykey +
        "&json=y",
      function(error, response, north) {
        console.error("North error:", error);
        request(
          "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=" +
            destination +
            "&dir=s&key=" +
            Mykey +
            "&json=y",
          function(error, response, south) {
            console.error("South error:", error);
            res.render("ninteenth.ejs", {
              South: JSON.parse(south),
              North: JSON.parse(north)
            });
          }
        );
      }
    );
});

const server = app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

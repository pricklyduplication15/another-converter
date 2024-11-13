const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

let app = express();

// Conversion functions
const galToLiters = (gallons) => gallons * 3.78541;
const litToGal = (liters) => liters * 0.264172;
const milesToKm = (miles) => miles * 1.60934;
const kmToMiles = (km) => km * 0.621371;
const poundsToKg = (pounds) => pounds * 0.453592;
const kgToPounds = (kg) => kg * 2.20462;

app.use("/public", express.static(process.cwd() + "/public"));
app.use(cors({ origin: "*" })); // For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// For FCC testing purposes
fccTestingRoutes(app);

// Routing for API
apiRoutes(app);

app.get("/api/convert", (req, res) => {
  const input = req.query.input; // Get the 'input' query parameter
  if (!input) {
    return res.status(400).send({ error: "Input parameter is required" });
  }

  const value = parseFloat(input); // Extract numeric value from the input
  if (isNaN(value)) {
    return res.status(400).send({ error: "Invalid input format" });
  }

  let result;
  if (input.toLowerCase().endsWith("gal")) {
    result = galToLiters(value);
    res.send({ input, unit: "gal", result });
  } else if (
    input.toLowerCase().endsWith("l") &&
    !input.toLowerCase().endsWith("gal")
  ) {
    result = litToGal(value);
    res.send({ input, unit: "liters", result });
  } else if (
    input.toLowerCase().endsWith("miles") &&
    !input.toLowerCase().endsWith("km")
  ) {
    result = milesToKm(value);
    res.send({ input, unit: "miles", result });
  } else if (
    input.toLowerCase().endsWith("km") &&
    !input.toLowerCase().endsWith("miles")
  ) {
    result = kmToMiles(value);
    res.send({ input, unit: "km", result });
  } else if (
    input.toLowerCase().endsWith("lbs") &&
    !input.toLowerCase().endsWith("kg")
  ) {
    result = poundsToKg(value);
    res.send({ input, unit: "pounds", result });
  } else if (
    input.toLowerCase().endsWith("kg") &&
    !input.toLowerCase().endsWith("pounds")
  ) {
    result = kgToPounds(value);
    res.send({ input, unit: "kg", result });
  } else {
    return res.status(400).send({
      error: 'Invalid unit. Use "gal" for gallons or "l" for liters.',
    });
  }
});

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

// Export app and server for testing purposes
let server;
if (process.env.NODE_ENV !== "test") {
  const port = 3001;
  server = app.listen(port, function () {
    console.log("Listening on port " + port);
    if (process.env.NODE_ENV === "test") {
      console.log("Running Tests...");
      setTimeout(function () {
        try {
          runner.run();
        } catch (e) {
          console.log("Tests are not valid:");
          console.error(e);
        }
      }, 5000);
    }
  });
}

module.exports = { app, server }; // Export both app and server for testing

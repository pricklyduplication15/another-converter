const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

let app = express();

// Conversion functions
const galToLiters = (gallons) => (gallons * 3.78541).toFixed(5);
const litToGal = (liters) => (liters * 0.264172).toFixed(5);
const milesToKm = (miles) => (miles * 1.60934).toFixed(5);
const kmToMiles = (km) => (km * 0.621371).toFixed(5);
const poundsToKg = (pounds) => (pounds * 0.453592).toFixed(5);
const kgToPounds = (kg) => (kg * 2.20462).toFixed(5);

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
    return res.status(400).json({ error: "Input parameter is required" }); // Changed to res.json
  }

  const value = parseFloat(input); // Extract numeric value from the input
  if (isNaN(value)) {
    return res.status(400).json({ error: "Invalid input format" }); // Changed to res.json
  }

  let result;
  if (input.toLowerCase().endsWith("gal")) {
    result = galToLiters(value);
    return res.json({ input, unit: "gal", result }); // Changed to res.json
  } else if (
    input.toLowerCase().endsWith("l") &&
    !input.toLowerCase().endsWith("gal")
  ) {
    result = litToGal(value);
    return res.json({ input, unit: "liters", result }); // Changed to res.json
  } else if (
    input.toLowerCase().endsWith("miles") &&
    !input.toLowerCase().endsWith("km")
  ) {
    result = milesToKm(value);
    return res.json({ input, unit: "miles", result }); // Changed to res.json
  } else if (
    input.toLowerCase().endsWith("km") &&
    !input.toLowerCase().endsWith("miles")
  ) {
    result = kmToMiles(value);
    return res.json({ input, unit: "km", result }); // Changed to res.json
  } else if (
    input.toLowerCase().endsWith("lbs") &&
    !input.toLowerCase().endsWith("kg")
  ) {
    result = poundsToKg(value);
    return res.json({ input, unit: "pounds", result }); // Changed to res.json
  } else if (
    input.toLowerCase().endsWith("kg") &&
    !input.toLowerCase().endsWith("pounds")
  ) {
    result = kgToPounds(value);
    return res.json({ input, unit: "kg", result }); // Changed to res.json
  } else {
    return res.status(400).json({
      error: 'Invalid unit. Use "gal" for gallons or "l" for liters.',
    }); // Changed to res.json
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

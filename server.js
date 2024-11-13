const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");
const ConvertHandler = require("./controllers/convertHandler"); // Import ConvertHandler
const convertHandler = new ConvertHandler(); // Create an instance of ConvertHandler

let app = express();

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

// API conversion route
app.get("/api/convert", (req, res) => {
  console.log("req.query:", req.query); // Log the full query object

  const { input } = req.query;

  if (input) {
    // Get numeric input and unit from the input
    const num = convertHandler.getNum(input);
    const unitName = convertHandler.getUnit(input);

    if (num && !unitName) {
      console.log("Error: Invalid unit");
      return res.status(400).json({ error: "Invalid unit" });
    }

    if (!input || num == NaN || unitName == null) {
      return res.status(400).json({ error: "Invalid input format" });
    }
    // Debug logs to see extracted inputs
    console.log(`Extracted number: ${num}, Extracted unit: ${unitName}`);

    // Validate the extracted unit

    // Validate the numeric part
    if (num === null || isNaN(num)) {
      console.log("Error: Invalid number format");
      return res.status(400).json({ error: "Invalid number format" });
    }

    // Get the converted unit
    const returnUnit = convertHandler.getReturnUnit(unitName);

    // Perform the conversion
    const convertedValue = convertHandler.convert(num, unitName);

    // Create the result string
    const result = convertHandler.getString(
      num,
      unitName,
      convertedValue,
      returnUnit
    );

    // Respond with JSON result
    res.status(200).json({
      initNum: num.toFixed(5),
      initUnit: unitName,
      returnNum: convertedValue.toFixed(5),
      returnUnit: returnUnit,
      string: result,
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
  const port = 3002;
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

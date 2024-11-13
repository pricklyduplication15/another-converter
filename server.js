const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js"); // Import API routes
const fccTestingRoutes = require("./routes/fcctesting.js"); // Import FCC testing routes
const runner = require("./test-runner"); // Import test runner

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

// Routing for API (use the routes defined in api.js)
apiRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

// Export app and server for testing purposes
let server;
if (process.env.NODE_ENV !== "test") {
  const port = 3002; // Define port
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

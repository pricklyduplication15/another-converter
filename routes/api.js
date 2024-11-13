"use strict";

const ConvertHandler = require("../controllers/convertHandler.js"); // Import the ConvertHandler

module.exports = function (app) {
  let convertHandler = new ConvertHandler(); // Instantiate the ConvertHandler class

  // Define the route for '/api/convert' and handle the GET request
  app.get("/api/convert", (req, res) => {
    const { input } = req.query; // Get the 'input' query parameter
    console.log("Input received:", input);

    if (!input) {
      console.log("Error: No input provided");
      return res.status(400).json({ error: "No input provided" });
    }

    // Get numeric part and unit from the input
    const num = convertHandler.getNum(input);
    let unitName = convertHandler.getUnit(input);

    // Log extracted number and unit
    console.log("Extracted number:", num);
    console.log("Extracted unit:", unitName);

    // If either num or unit is invalid, return an error
    if (num === null || !input) {
      console.log("Error: Invalid number extracted");
      return res.status(400).json({ error: "Invalid input format" });
    }
    if (unitName === null) {
      console.log("Error: Invalid unit extracted");
      return res.status(400).json({ error: "Invalid unit" });
    }

    // List of valid units (including 'L' for liters)
    const validUnits = ["gal", "L", "mi", "km", "lbs", "kg"];
    console.log("Valid units:", validUnits);

    // Check if the unit is valid and handle 'L' as a special case
    if (unitName === "L" || validUnits.includes(unitName.toLowerCase())) {
      console.log("Valid unit:", unitName);
    } else {
      console.log("Error: Invalid unit provided:", unitName);
      return res.status(400).json({ error: "Invalid unit" });
    }

    // Perform the conversion
    const returnUnit = convertHandler.getReturnUnit(unitName);
    console.log("Return unit:", returnUnit);

    const convertedValue = convertHandler.convert(num, unitName);
    console.log("Converted value:", convertedValue);

    // Generate the result string
    const result = convertHandler.getString(
      num,
      unitName,
      convertedValue,
      returnUnit
    );
    console.log("Conversion result:", result);

    // Return the result in JSON format
    return res.status(200).json({
      initNum: num,
      initUnit: unitName,
      returnNum: convertedValue,
      returnUnit: returnUnit,
      string: result,
    });
  });
};

function ConvertHandler() {
  // Extracts the numeric value from the input (e.g., "4gal" → 4)
  this.getNum = function (input) {
    const numRegex = /^[0-9./]+/; // Regex to extract the number (including fractions)
    let result = input.match(numRegex); // Extract numeric part
    if (!result) {
      return null; // Return null if no valid number found
    }

    // Handle fractions (e.g., "1/2", "3/4")
    if (result[0].includes("/")) {
      const [numerator, denominator] = result[0].split("/");
      result = parseFloat(numerator) / parseFloat(denominator);
    } else {
      result = parseFloat(result[0]);
    }
    return result;
  };

  // Modify getUnit to ensure consistency in cases
  this.getUnit = function (input) {
    const unitRegex = /[a-zA-Z]+$/; // Ensure it captures alphabetic unit at the end
    const result = input.match(unitRegex);
    const validUnits = ["gal", "l", "miles", "km", "lbs", "kg"];
    if (!result || !validUnits.includes(result[0].toLowerCase())) {
      return null;
    }
    return result[0].toLowerCase(); // Return lowercase for consistency
  };

  // Returns the return unit for the conversion
  this.getReturnUnit = function (initUnit) {
    const unitMap = {
      gal: "L",
      L: "gal",
      l: "gal",
      miles: "km",
      km: "miles",
      lbs: "kg",
      kg: "lbs",
    };
    return unitMap[initUnit] || null; // Return mapped unit or null if not found
  };

  // Spells out the unit in full (e.g., "gal" → "gallons")
  this.spellOutUnit = function (unit) {
    const unitMap = {
      gal: "gallons",
      L: "liters",
      l: "liters",
      miles: "miles",
      km: "kilometers",
      lbs: "pounds",
      kg: "kilograms",
    };
    return unitMap[unit] || unit; // Return full unit name or the original unit if not found
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    const conversionMap = {
      gal: initNum * galToL,
      L: initNum / galToL,
      l: initNum / galToL,
      miles: initNum * miToKm,
      km: initNum / miToKm,
      lbs: initNum * lbsToKg,
      kg: initNum / lbsToKg,
    };

    return (
      Math.round((conversionMap[initUnit] + Number.EPSILON) * 100000) / 100000
    );
  };

  // Returns a string with the conversion result
  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    const initUnitSpelled = this.spellOutUnit(initUnit);
    const returnUnitSpelled = this.spellOutUnit(returnUnit);
    return `${initNum} ${initUnitSpelled} converts to ${returnNum} ${returnUnitSpelled}`;
  };
}

module.exports = ConvertHandler;

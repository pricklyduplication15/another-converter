class ConvertHandler {
  constructor() {
    this.validUnits = ["gal", "l", "miles", "km", "lbs", "kg"];
  }

  // Extract numeric part of the input (supports fractions, decimals, and negative numbers)
  getNum(input) {
    const result = input.match(/^([\-+]?[0-9]*\.?[0-9\/]+)([a-zA-Z]+)$/); // Update regex to handle more cases
    if (result) {
      // Check if it's a valid fraction and evaluate it
      if (result[1].includes("/")) {
        const [numerator, denominator] = result[1].split("/");
        return parseFloat(numerator) / parseFloat(denominator);
      }
      return parseFloat(result[1]); // Use parseFloat for decimal numbers
    }
    return null; // Return null for invalid input
  }

  // Extract the unit part of the input and normalize to lowercase
  getUnit(input) {
    const unitRegex = /[a-zA-Z]+$/; // Match alphabetic unit part
    const result = input.match(unitRegex); // Extract unit

    if (result) {
      const unit = result[0].toLowerCase(); // Normalize to lowercase

      // If unit is "l" (liters), always return "L"
      if (unit === "l") {
        return "L";
      }

      // For other units, check if they are valid
      if (this.validUnits.includes(unit)) {
        return unit;
      } else {
        return null; // Return null for %s
      }
    }
  }

  // Returns the return unit for the conversion
  getReturnUnit(initUnit) {
    const unitMap = {
      gal: "L",
      L: "gal",
      miles: "km",
      km: "miles",
      lbs: "kg",
      kg: "lbs",
    };
    return unitMap[initUnit] || null; // Return mapped unit or null if not found
  }

  // Spells out the unit in full (e.g., "gal" → "gallons")
  spellOutUnit(unit) {
    const unitMap = {
      gal: "gallons",
      L: "liters",
      miles: "miles",
      km: "kilometers",
      lbs: "pounds",
      kg: "kilograms",
    };
    return unitMap[unit] || unit; // Return full unit name or the original unit if not found
  }

  // Perform the conversion based on the unit and numeric value
  convert(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    const conversionMap = {
      gal: initNum * galToL,
      L: initNum / galToL,
      miles: initNum * miToKm,
      km: initNum / miToKm,
      lbs: initNum * lbsToKg,
      kg: initNum / lbsToKg,
    };

    return conversionMap[initUnit];
  }

  // Returns a string with the conversion result
  getString(initNum, initUnit, returnNum, returnUnit) {
    const initUnitSpelled = this.spellOutUnit(initUnit);
    const returnUnitSpelled = this.spellOutUnit(returnUnit);
    return `${initNum} ${initUnitSpelled} converts to ${returnNum} ${returnUnitSpelled}`;
  }
}

module.exports = ConvertHandler;

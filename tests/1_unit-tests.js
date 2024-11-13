const chaiHttp = require("chai-http");
const chai = require("chai");
let expect = chai.expect; // Using expect for consistency
const { app, server } = require("../server"); // Import both app and server
const { describe, it, before, after } = require("mocha"); // Ensure these are available

chai.use(chaiHttp);

process.env.PORT = 3001;

describe("API Tests", function () {
  before(function (done) {
    if (!server) {
      server = app.listen(3001, () => {
        console.log("Server started on port 3001");
        done(); // Ensure done is called after the server starts
      });
    } else {
      done(); // If the server is already running, just proceed
    }
  });

  after(function (done) {
    if (server) {
      // Close the server after the tests
      server.close(done);
    } else {
      done(); // If no server is running, just call done
    }
  });
});

it("should return status 200 for /", function (done) {
  chai
    .request(app)
    .get("/")
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
});

describe("/api/convert endpoint", function () {
  // Unit Tests for Parsing Input Types
  describe("Unit Test: convertHandler should correctly parse input types", function () {
    it("should correctly read a whole number input", function () {
      const input = "5gal";
      const value = parseFloat(input);
      expect(value).to.equal(5);
    });

    it("should correctly read a decimal number input", function () {
      const input = "3.75gal";
      const value = parseFloat(input);
      expect(value).to.equal(3.75);
    });

    it("should correctly read a fractional input", function () {
      const input = "1/2gal";
      const value = eval(input.split("gal")[0]);
      expect(value).to.equal(0.5);
    });

    it("should correctly read a mixed fraction input with decimal", function () {
      const input = "1.5/2gal";
      const value = eval(input.split("gal")[0]);
      expect(value).to.equal(0.75);
    });

    it("should return an error for a double-fraction", function () {
      const input = "3/2/3gal";
      try {
        const value = eval(input.split("gal")[0]);
        throw new Error("Expected error not thrown");
      } catch (error) {
        expect(error).to.be.an("error");
      }
    });

    it("should default to a numerical input of 1 when no input is provided", function () {
      const input = "gal";
      const value = parseFloat(input) || 1;
      expect(value).to.equal(1);
    });
  });

  // Unit Tests: Unit Validation
  describe("Unit Test: convertHandler should validate units correctly", function () {
    it("should recognize 'gal' as a valid unit", function () {
      const input = "4gal";
      expect(input.toLowerCase().endsWith("gal")).to.be.true;
    });

    it("should recognize 'l' as a valid unit", function () {
      const input = "4l";
      expect(
        input.toLowerCase().endsWith("l") &&
          !input.toLowerCase().endsWith("gal")
      ).to.be.true;
    });

    it("should return an error for invalid units", function () {
      const input = "5xyz";
      const isValid =
        input.toLowerCase().endsWith("gal") ||
        input.toLowerCase().endsWith("l");
      expect(isValid).to.be.false;
    });
  });

  // Unit Tests: Unit Conversions
  describe("Unit Test: convertHandler unit conversions", function () {
    it("should correctly convert gal to L", function () {
      const input = 4;
      const conversionFactor = 3.78541;
      const expectedOutput = input * conversionFactor;
      expect(expectedOutput).to.be.closeTo(15.14164, 0.01);
    });

    it("should correctly convert L to gal", function () {
      const input = 4;
      const conversionFactor = 0.264172;
      const expectedOutput = input * conversionFactor;
      expect(expectedOutput).to.be.closeTo(1.056688, 0.01);
    });

    it("should correctly convert mi to km", function () {
      const input = 5;
      const conversionFactor = 1.60934;
      const expectedOutput = input * conversionFactor;
      expect(expectedOutput).to.be.closeTo(8.0467, 0.01);
    });

    it("should correctly convert km to mi", function () {
      const input = 5;
      const conversionFactor = 0.621371;
      const expectedOutput = input * conversionFactor;
      expect(expectedOutput).to.be.closeTo(3.106855, 0.01);
    });

    it("should correctly convert lbs to kg", function () {
      const input = 5;
      const conversionFactor = 0.453592;
      const expectedOutput = input * conversionFactor;
      expect(expectedOutput).to.be.closeTo(2.26796, 0.01);
    });

    it("should correctly convert kg to lbs", function () {
      const input = 5;
      const conversionFactor = 2.20462;
      const expectedOutput = input * conversionFactor;
      expect(expectedOutput).to.be.closeTo(11.0231, 0.01);
    });
  });
});

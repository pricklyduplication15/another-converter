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

  it("should return status 200 for /", function (done) {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("Functional Tests", function () {
  describe("Functional Test: GET /api/convert", function () {
    it("should return the correct conversion for 4gal", function (done) {
      chai
        .request(app)
        .get("/api/convert?input=4gal")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("input", "4gal");
          expect(res.body).to.have.property("unit", "gal");
          expect(res.body).to.have.property("result").that.is.a("number");

          const expectedConversion = 15.14164;
          expect(res.body.result).to.be.closeTo(expectedConversion, 0.01);
          done();
        });
    });

    it("should return the correct conversion for 4L", function (done) {
      chai
        .request(app)
        .get("/api/convert?input=4L")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("input", "4L");
          expect(res.body).to.have.property("unit", "liters");
          expect(res.body).to.have.property("result").that.is.a("number");

          const expectedConversion = 1.056688;
          expect(res.body.result).to.be.closeTo(expectedConversion, 0.01);
          done();
        });
    });

    it("should return the correct conversion for 5 miles", function (done) {
      chai
        .request(app)
        .get("/api/convert?input=5miles")
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("input", "5miles");
          expect(res.body).to.have.property("unit", "miles");
          expect(res.body).to.have.property("result").that.is.a("number");

          const expectedConversion = 8.04672;
          console.log("Actual Conversion:", res.body.result); // Log the actual conversion result
          expect(res.body.result).to.be.closeTo(expectedConversion, 0.01); // Check if the result is within 0.01 of expected value
          done();
        });
    });

    it("should return the correct conversion for 5km", function (done) {
      chai
        .request(app)
        .get("/api/convert?input=5km")
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("input", "5km");
          expect(res.body).to.have.property("unit", "km");
          expect(res.body).to.have.property("result").that.is.a("number");

          const expectedConversion = 3.106855;
          expect(res.body.result).to.be.closeTo(expectedConversion, 0.01);
          done();
        });
    });

    it("should return the correct conversion for 5lbs", function (done) {
      chai
        .request(app)
        .get("/api/convert?input=5lbs")
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("input", "5lbs");
          expect(res.body).to.have.property("unit", "pounds");
          expect(res.body).to.have.property("result").that.is.a("number");

          const expectedConversion = 2.26796;
          expect(res.body.result).to.be.closeTo(expectedConversion, 0.01);
          done();
        });
    });

    it("should return the correct conversion for 5kg", function (done) {
      chai
        .request(app)
        .get("/api/convert?input=5kg")
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("input", "5kg");
          expect(res.body).to.have.property("unit", "kg");
          expect(res.body).to.have.property("result").that.is.a("number");

          const expectedConversion = 11.0231;
          expect(res.body.result).to.be.closeTo(expectedConversion, 0.01);
          done();
        });
    });

    it("should return an error for invalid input", function (done) {
      chai
        .request(app)
        .get("/api/convert?input=invalidInput")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("error", "Invalid input format");
          done();
        });
    });

    it("should return an error for invalid unit", function (done) {
      chai
        .request(app)
        .get("/api/convert?input=4xyz")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property(
            "error",
            'Invalid unit. Use "gal" for gallons or "l" for liters.'
          );
          done();
        });
    });
  });
});

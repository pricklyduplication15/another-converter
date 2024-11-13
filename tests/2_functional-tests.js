const chaiHttp = require("chai-http");
const chai = require("chai");
let expect = chai.expect; // Using expect for consistency
let { app, server } = require("../server"); // Import both app and server
const { describe, it, before, after } = require("mocha"); // Ensure these are available

chai.use(chaiHttp);

process.env.PORT = 3000;

describe("API Tests", function () {
  before(async function () {
    // Start server only if it is not already running
    if (!server) {
      server = app.listen(3000, () => {
        console.log("Server started on port 3000");
      });

      // Wait until the server is listening before proceeding
      await new Promise((resolve) => server.on("listening", resolve));
    } else {
      console.log("Server is already running");
    }
  });

  after(async function () {
    if (server) {
      console.log("Closing server...");
      await new Promise((resolve) => server.close(resolve)); // Wait until the server is fully closed
      console.log("Server closed");
      server = null; // Reset the server instance to avoid reuse
    } else {
      console.log("No server to close");
    }
  });

  describe("Functional Tests", function () {
    describe("Functional Test: GET /api/convert", function () {
      it("should return the correct conversion for 4gal", function (done) {
        chai
          .request(app)
          .get("/api/convert?input=4gal")
          .end((err, res) => {
            const expectedConversion = 15.14164;

            console.log("Actual response:", res.body);
            console.log("Expected initUnit:", "gal");
            console.log("Expected returnUnit:", "L");
            console.log("Expected returnNum (close to):", expectedConversion);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("initUnit", "gal");
            expect(res.body).to.have.property("returnUnit", "L");
            expect(res.body.returnNum).to.be.closeTo(expectedConversion, 0.01);
            done();
          });
      });

      it("should return the correct conversion for 4L", function (done) {
        chai
          .request(app)
          .get("/api/convert?input=4L")
          .end((err, res) => {
            const expectedConversion = 1.056688;

            console.log("Actual response:", res.body);
            console.log("Expected initUnit:", "L");
            console.log("Expected returnUnit:", "gal");
            console.log("Expected returnNum (close to):", expectedConversion);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("initUnit", "L");
            expect(res.body).to.have.property("returnUnit", "gal");
            expect(res.body.returnNum).to.be.closeTo(expectedConversion, 0.01);
            done();
          });
      });

      // Repeat similar refactoring for other test cases
      it("should return an error for invalid input", function (done) {
        chai
          .request(app)
          .get("/api/convert?input=invalidInput")
          .end((err, res) => {
            console.log("Actual response:", res.body);
            console.log("Expected error message:", "Invalid input format");

            expect(res).to.have.status(400);
            expect(res.body).to.have.property("error", "Invalid input format");
            done();
          });
      });

      it("should return an error for invalid unit", function (done) {
        chai
          .request(app)
          .get("/api/convert?input=4xyz")
          .end((err, res) => {
            console.log("Actual response:", res.body);
            console.log("Expected error message:", "Invalid unit");

            expect(res).to.have.status(400);
            expect(res.body).to.have.property("error", "Invalid unit");
            done();
          });
      });
    });
  });
});

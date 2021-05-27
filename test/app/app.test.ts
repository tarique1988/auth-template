// the base route tests will go here
import mocha from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const request = chai.request("localhost:3000/api/v1");

describe("Testing the base route", () => {
	it("GET / should return 404 not found", (done) => {
		request
			.get("/")
			.then((res) => {
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});
});

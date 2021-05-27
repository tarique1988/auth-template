import mocha from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

chai.use(chaiHttp);
const request = chai.request("localhost:3000/api/v1/users/");

describe("Testing the /users/ route", () => {
	let nonExistentId: string;
	let invalidId = "123456";
	let temporaryId: string;
	let anotherTempId: string;

	before((done) => {
		nonExistentId = new mongoose.Types.ObjectId().toHexString();
		anotherTempId = new mongoose.Types.ObjectId().toHexString();
		chai.request("localhost:3000/api/v1/auth")
			.post("/register")
			.set({ "content-type": "application/json" })
			.send({
				_id: anotherTempId,
				name: `${anotherTempId}`,
				email: `${anotherTempId}`,
				password: `${anotherTempId}`
			})
			.then((res) => {
				if (res.body.success) console.log("Temp created!");
				else console.log("temp creation failed!", res.body);
				done();
			})
			.catch((err) => done(err));
	});

	beforeEach((done) => {
		temporaryId = new mongoose.Types.ObjectId().toHexString();
		chai.request("localhost:3000/api/v1/auth")
			.post("/register")
			.set({ "content-type": "application/json" })
			.send({
				_id: temporaryId,
				name: `${temporaryId}`,
				email: `${temporaryId}`,
				password: `${temporaryId}`
			})
			.then((res) => {
				if (res.body.success) console.log("Temp created!");
				else console.log("temp creation failed!", res.body);
				done();
			})
			.catch((err) => done(err));
	});

	afterEach((done) => {
		chai.request("localhost:3000/api/v1/users/id")
			.delete(`/${temporaryId}`)
			.then((res) => {
				if (res.body.success) console.log("Temp Deleted!");
				else console.log("temp was already deleted.");
				done();
			})
			.catch((err) => done(err));
	});

	it("GET / should return 200 OK", (done) => {
		request
			.get("/")
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(200);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("POST / should return 404 Not found", (done) => {
		request
			.post("/")
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("GET /id without ids should return 400 Bad request", (done) => {
		request
			.get("/id")
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(400);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("GET /id without valid ids should return 404 not found", (done) => {
		request
			.get(`/id?ids=${invalidId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("GET /id/:id without valid id should return 404 not found", (done) => {
		request
			.get(`/id/${invalidId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("GET /id/:id with non-existent id should return 404 not found", (done) => {
		request
			.get(`/id/${nonExistentId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("GET /id/:id with existing id should return 200 OK", (done) => {
		request
			.get(`/id/${temporaryId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(200);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("PUT /id without valid ids should return 404", (done) => {
		request
			.put(`/id?ids=${invalidId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("PUT /id with non-existing ids should return 404", (done) => {
		request
			.put(`/id?ids=${nonExistentId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("PUT /id should return 404 Not found!", (done) => {
		request
			.put("/id")
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("PUT /id/:id without valid id should return 404 not found!", (done) => {
		request
			.put(`/id/${invalidId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("PUT /id/:id with a non existing id should return 404 not found!", (done) => {
		request
			.put(`/id/${nonExistentId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("PUT /id/:id with existing id should return 200 OK", (done) => {
		request
			.put(`/id/${temporaryId}`)
			.set({ "content-type": "application/json" })
			.send({
				name: "TAM"
			})
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(200);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("DELETE /id without ids should return 400 Bad request", (done) => {
		request
			.del("/id")
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(400);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("DELETE /id without valid ids should return 404", (done) => {
		request
			.del(`/id?ids=${invalidId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("DELETE /id with non-existing ids should return 404", (done) => {
		request
			.del(`/id?ids=${nonExistentId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("DELETE /id with valid ids should return 200 OK", (done) => {
		request
			.del(`/id?ids=${temporaryId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(200);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("DELETE /id/:id without valid id should return 404 Not found", (done) => {
		request
			.del(`/id/${invalidId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("DELETE /id/:id with a non-existing id should return 404", (done) => {
		request
			.del(`/id/${nonExistentId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(404);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it("DELETE /id/:id with an existing id should return 200", (done) => {
		request
			.del(`/id/${anotherTempId}`)
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(200);
				done();
			})
			.catch((err) => {
				done(err);
			});
	});
});

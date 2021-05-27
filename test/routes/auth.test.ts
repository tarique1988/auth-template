import mocha from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

chai.use(chaiHttp);
const request = chai.request("http://localhost:3000/api/v1/auth");

describe("Testing the /auth route", () => {
	let token: string;
	let id = new mongoose.Types.ObjectId().toHexString();
	const user = {
		_id: id,
		name: "test",
		email: "test@gmail.com",
		password: "123456"
	};

	const registerUser = {
		_id: new mongoose.Types.ObjectId().toHexString(),
		name: "register",
		email: "register@gmail.com",
		password: "123456"
	};

	beforeEach((done) => {
		request
			.post("/register")
			.set({ "content-type": "application/json" })
			.send(user)
			.then((res) => {
				if (res.body.success) token = res.body.data.token;
				else console.log("registration failed!", res.body.message);
				done();
			})
			.catch((err) => done(err));
	});

	afterEach((done) => {
		chai.request("localhost:3000/api/v1/users")
			.delete(`/id/${id}`)
			.then((res) => {
				if (res.body.success) console.log("Deleted!", id);
				else console.log("deletion failed!", res.body.message);
				done();
			})
			.catch((err) => done(err));
	});

	after((done) => {
		chai.request("localhost:3000/api/v1/users")
			.delete(`/id/${registerUser._id}`)
			.then((res) => {
				if (res.body.success) console.log("Deleted!", registerUser._id);
				else console.log("deletion failed!", res.body.message);
				done();
			})
			.catch((err) => done(err));
	});

	it("GET / without authorization header should return 401", (done) => {
		request
			.get("/")
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(401);
				done();
			})
			.catch((err) => done(err));
	});

	it("GET / with invalid authorization header should return 401", (done) => {
		request
			.get("/")
			.set({ Authorization: "Bearer .a.a.a.a" })
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(401);
				done();
			})
			.catch((err) => done(err));
	});

	it("GET / with valid authorization header should return 200 OK", (done) => {
		request
			.get("/")
			.set({ Authorization: `Bearer ${token}` })
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(200);
				done();
			})
			.catch((err) => done(err));
	});

	it("POST /register without body should return 400", (done) => {
		request
			.post("/register")
			.set({ "content-type": "application/json" })
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(400);
				done();
			})
			.catch((err) => done(err));
	});

	it("POST /register without valid body should return 400", (done) => {
		request
			.post("/register")
			.set({ "content-type": "application/json" })
			.send({
				name: "Tarique",
				email: "1@2.com",
				password: "123"
			})
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(400);
				done();
			})
			.catch((err) => done(err));
	});

	it("POST /register with valid body should return 201 CREATED", (done) => {
		request
			.post("/register")
			.set({ "content-type": "application/json" })
			.send(registerUser)
			.then((res) => {
				expect(res.status).to.eq(201);
				done();
			})
			.catch((err) => done(err));
	});

	it("POST /login without valid credentials should return 401", (done) => {
		request
			.post("/login")
			.set({ "content-type": "application/json" })
			.send({
				email: "wrongemail@gmail.com",
				password: "wrongpassword"
			})
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(401);
				done();
			})
			.catch((err) => done(err));
	});

	it("POST /login without credentials should return 401", (done) => {
		request
			.post("/login")
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(401);
				done();
			})
			.catch((err) => done(err));
	});

	it("POST /login with valid credentials should return 200", (done) => {
		request
			.post("/login")
			.set({ "content-type": "application/json" })
			.send({
				email: user.email,
				password: user.password
			})
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(200);
				done();
			})
			.catch((err) => done(err));
	});

	it("POST /password-reset-token with valid email should return 200", (done) => {
		request
			.post("/password-reset-token")
			.set({ "content-type": "application/json" })
			.send({
				email: user.email
			})
			.then((res) => {
				expect(res.status).to.eq(200);
				console.log(
					`Password reset token for ${user.email} is ${res.body.data.token}`
				);
				done();
			})
			.catch((err) => done(err));
	});

	it("POST /password-reset-token without valid email should return 400", (done) => {
		request
			.post("/password-reset-token")
			.set({ "content-type": "application/json" })
			.send({
				email: "invalid@email.com"
			})
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(400);
				done();
			})
			.catch((err) => done(err));
	});

	it("POST /password-reset-token without email should return 400", (done) => {
		request
			.post("/password-reset-token")
			.then((res) => {
				// console.log(res.body);
				expect(res.status).to.eq(400);
				done();
			})
			.catch((err) => done(err));
	});
});

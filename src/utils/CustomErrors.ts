export default class CustomError extends Error {
	statusCode: number;
	constructor(name: string, statusCode: number, message: string) {
		super(message);
		this.name = name;
		this.statusCode = statusCode;
	}
}

export class ForbiddenError extends CustomError {
	constructor(message: string) {
		super("ForbiddenError", 403, message);
	}
}

export class UnAuthorizedError extends CustomError {
	constructor(message: string) {
		super("UnAuthorizedError", 401, message);
	}
}

export class BadRequestError extends CustomError {
	constructor(message: string) {
		super("BadRequestError", 400, message);
	}
}

export class ResourceNotFoundError extends CustomError {
	constructor(message: string) {
		super("ResourceNotFoundError", 404, message);
	}
}

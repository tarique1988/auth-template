import { NextFunction, Request, Response } from "express";
import CustomError, {
	ResourceNotFoundError,
	UnAuthorizedError,
	BadRequestError
} from "../utils/CustomErrors";
import getJsonResponse from "../utils/JsonResponse";

export default (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let error: CustomError;

	switch (err.name) {
		case "ResourceNotFoundError":
		case "BadRequestError":
		case "ForbiddenError":
		case "UnAuthorizedError":
		case "CustomError":
			error = err as CustomError;
			break;
		case "ValidationError":
			error = new BadRequestError(err.message);
			break;
		case "CastError":
			error = new ResourceNotFoundError(
				"Could not find the requested resource."
			);
			break;
		case "TokenExpiredError":
			error = new UnAuthorizedError("Authorization failed.");
			break;
		case "JsonWebTokenError":
			error = new UnAuthorizedError("Authorization failed.");
			break;
		default:
			error = new CustomError(err.name, 500, err.message);
			break;
	}
	res
		.status(error.statusCode)
		.json(getJsonResponse({}, "An error occured!", false, [error]));
};

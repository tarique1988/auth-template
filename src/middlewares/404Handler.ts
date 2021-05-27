import { NextFunction, Request, Response } from "express";
import { ResourceNotFoundError } from "../utils/CustomErrors";

export default (req: Request, res: Response, next: NextFunction) => {
	throw new ResourceNotFoundError(
		"Your requested resource could not be found."
	);
};

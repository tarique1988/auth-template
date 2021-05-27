import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import getJsonResponse from "../utils/JsonResponse";
import userHelper from "../data/helpers/users";

/**
 * Gets a list of all registered users
 * @private Admin only
 */
const getUsers = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const users = await userHelper.getUsers();
		res.status(200).json(getJsonResponse({ users }));
	}
);
/**
 * Gets a specific user by id
 * @private User and Admin
 */
const getUserById = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await userHelper.getUserById(req.params.id);
		res.status(200).json(getJsonResponse({ user }));
	}
);

/**
 * Gets a list of users by a comma separated list of ids
 * @private Admin only
 */
const getUsersByIds = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const users = await userHelper.getUsersByIds(req.query.ids as string);

		res.status(200).json(getJsonResponse({ users }));
	}
);

/**
 * Updates a user by id
 * @private User and Admin
 */
const updateUserById = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const updatedUser = await userHelper.updateUserById(
			req.params.id,
			req.body
		);

		res.status(200).json(
			getJsonResponse(
				{ user: { name: updatedUser.name, email: updatedUser.email } },
				"User updated"
			)
		);
	}
);

/**
 * Deletes a user by id
 * @public Admin only
 */
const deleteUserById = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const result = await userHelper.deleteUsersByIds(req.params.id);

		res.status(200).json(
			getJsonResponse({ deleteCount: result.deletedCount })
		);
	}
);

/**
 * Deletes a list of users by a comma separated list of ids
 * @private Admin only
 */
const deleteUsersByIds = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const result = await userHelper.deleteUsersByIds(
			req.query.ids as string
		);

		res.status(200).json(
			getJsonResponse({ deleteCount: result.deletedCount })
		);
	}
);

/**
 * Exports all public functions as an object
 */
export default {
	getUsers,
	getUserById,
	getUsersByIds,
	updateUserById,
	deleteUserById,
	deleteUsersByIds
};

import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import getJsonResponse from "../utils/JsonResponse";
import authHelper from "./helpers/auth";

/**
 * Register a user and return the token within the response
 * @public
 */
const register = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const token = await authHelper.registerUser(req.body);

		res.status(201).json(
			getJsonResponse({ token }, `user registered successfully!`)
		);
	}
);

/**
 * Login an existing user with email and password and return the token within the response
 * @public
 */
const login = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		const token = await authHelper.loginByEmailPassword(email, password);

		res.status(200).json(
			getJsonResponse({ token }, `user logged in successfully!`)
		);
	}
);

/**
 * Get the user by authorization header
 * @private Only available to a logged in user
 */
const getCurrentUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
	const user = await authHelper.getAuthenticatedUser(
		req.headers.authorization as string
	);
		res.status(200).json(
			getJsonResponse(
				{ user: { id: user._id, name: user.name, email: user.email } },
				`You're logged in as ${user.email}!`
			)
		);
	}
);

/**
 * Reset the password of the user associated with the password reset token
 * @public
 */
const resetPassword = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await authHelper.updatePasswordWithResetToken(
			req.params.token,
			req.body.password
		);

		res.status(200).json(
			getJsonResponse(
				{ user: { name: user.name, email: user.email } },
				`password reset successfully!`
			)
		);
	}
);

/**
 * Generate and return the password reset token for the user associated with the email
 * @public
 */
const getPasswordResetToken = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const token = await authHelper.generatePasswordResetToken(
			req.body.email
		);

		res.status(200).json(
			getJsonResponse({ token }, `token generated successfully!`)
		);
	}
);

export default {
	register,
	login,
	getCurrentUser,
	resetPassword,
	getPasswordResetToken
};
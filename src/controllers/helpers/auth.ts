import { BadRequestError, UnAuthorizedError } from "../../utils/CustomErrors";
import { IUser } from "../../data/models/UserSchema";
import jwt from "jsonwebtoken";
import userHelper from "../../data/helpers/users";

/**
 * Registers a user and returns an auth token
 * @param user A valid user object {name, email, password}
 * @returns An auth token as a string
 * @throws {@link CustomError} if user object is missing or invalid or if creating a new user fails
 * @public
 */
const registerUser = async (user: IUser) => {
	if (!user)
		throw new BadRequestError("Please enter name, email, and password!"
		);
	const newUser = await userHelper.addUser(user);

	if (!newUser)
		throw new BadRequestError("There was a problem creating the user."
		);

	return newUser.getAuthToken();
};

/**
 * Logs in a user with the email and password and returns an auth token
 * @param email An email belonging to a registered user
 * @param password The password associated with the email
 * @returns An auth token as a string
 * @throws {@link CustomError} if credentials are invalid or empty
 * @public
 */
const loginByEmailPassword = async (email: string, password: string) => {
	if (!email || !password)
		throw new UnAuthorizedError("Invalid credentials");
	const user = await userHelper.getUserByEmailWithPassword(email);

	if (!user) throw new UnAuthorizedError("Invalid Credentials");

	if (!user.verifyPassword(password))
		throw new UnAuthorizedError("Invalid Credentials");

	return user.getAuthToken();
};

/**
 * Takes an auth token and returns the user associated with that token
 * @param token A valid auth token
 * @returns The user associated with the auth token
 * @throws {@link CustomError} if authorization fails
 * @private Admin and User
 */
const getAuthenticatedUser = async (authorization: string) => {
	if (!authorization)
		throw new UnAuthorizedError("Authorization failed.");
	const token = authorization?.split(" ")[1];
	if (!token)
		throw new UnAuthorizedError("Authorization failed.");
	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as unknown as string
		) as { id: string };
		if (!decoded || !decoded.id)
			throw new UnAuthorizedError("Authorization failed!");

		const user = await userHelper.getUserById(decoded.id);

		if (!user)
			throw new UnAuthorizedError("Authorization failed.");
		return user;
	} catch (err) {
		throw new UnAuthorizedError("Authorization Failed.");
	}
};

/**
 * Takes an email and returns a password reset token as a string
 * @param email An email belonging to a registered user
 * @returns a password reset token as a string
 * @throws {@link CustomError} if email is empty or not found to be registered
 * @public
 */
const generatePasswordResetToken = async (email: string) => {
	if (!email)
		throw new BadRequestError("Email cannot be empty!");

	const user = await userHelper.getUserByEmail(email);

	if (!user) throw new BadRequestError("Invalid Email");

	return jwt.sign(
		{ id: user._id },
		process.env.JWT_SECRET as unknown as string,
		{
			expiresIn: process.env.JWT_DURATION
		}
	);
};

/**
 * Updates the password for the user associated with the password-reset-token
 * @param token A valid password reset token associated with a user
 * @param password The new password
 * @throws {@link CustomError} if token/password is empty/invalid
 * @returns The updated user
 * @public
 */
const updatePasswordWithResetToken = async (
	token: string,
	password: string
) => {
	if (!token)
		throw new BadRequestError(
			"Password reset token is required!"
		);
	if (!password || password.length < 6)
		throw new BadRequestError(
			"Password must be at least 6 characters"
		);

	const decoded = jwt.verify(
		token,
		process.env.JWT_SECRET as unknown as string
	) as { id: string };

	if (!decoded || !decoded.id)
		throw new UnAuthorizedError("Authorization failed.");

	return await userHelper.updatePasswordById(decoded.id, password);
};

/**
 * Export all functions as an object
 */
export default {
	registerUser,
	loginByEmailPassword,
	getAuthenticatedUser,
	generatePasswordResetToken,
	updatePasswordWithResetToken
};

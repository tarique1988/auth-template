import { BadRequestError, ResourceNotFoundError, UnAuthorizedError } from "../../utils/CustomErrors";
import User, { IUser } from "../models/UserSchema";

/**
 * Creates a new user with a valid user object and returns the created user document
 * @param user A valid user object {name, email, password}
 * @returns the created user document: {@link IUser} if it succeeds
 */
const addUser = async (user: IUser) => {
	return await User.create(user);
};

/**
 * Finds all users present in the database and returns them as a list
 * @returns A list of users of type {@link IUser} if found, else an empty list
 */
const getUsers = async () => {
	return await User.find();
};

/**
 * Takes a comma separated list of valid Object id hex strings and returns a list of users
 * @param idsString A comma separated list of Object id hex strings belonging to users
 * @returns A list of users of type {@link IUser} corresponding to the ids if found else an empty list
 * @throws A {@link BadRequestError} if the idsString is empty/invalid
 */
const getUsersByIds = async (idsString: string) => {
	if (!idsString) throw new BadRequestError("Ids cannot be empty!");
	const idsTrimmed = idsString.trim();

	if (!idsTrimmed) throw new BadRequestError("Ids cannot be empty!");
	const ids = idsTrimmed.split(",");
	if (ids.length == 0) throw new BadRequestError("Id list cannot be empty!");
	return await User.find({ _id: { $in: ids } });
};

/**
 * Takes a valid Object id hex string and returns the user associated with it
 * @param id A valid Object id hex string
 * @returns a user of type {@link IUser} if found, else null
 * @throws A {@link ResourceNotFoundError} if user is not found!
 */
const getUserById = async (id: string) => {
	const user = await User.findById(id);
	if (!user) throw new ResourceNotFoundError("User not found!");
	return user;
};

/**
 * Search for a user by email and return along with the hashed password
 * @param email An email associated with a registered user
 * @returns A user along with his hashed password if found, else null
 */
const getUserByEmailWithPassword = async (email: string) => {
	return await User.findOne({ email: email }).select("password");
};

/**
 * Search for a user by email and return
 * @param email An email associated with a registered user
 * @returns A user if found, else null
 */
const getUserByEmail = async (email: string) => {
	return await User.findOne({ email: email });
};

/**
 * Finds an existing user by id, updates with the provided values, and returns the updated user.
 * @param id A valid Object id hex string for an existing user
 * @param user An object containing name/email to update, any other values are ignored.
 * @returns The updated user of type {@link IUser}
 * @throws A {@link BadRequestError} if the id or user is empty
 * @throws A {@link ResourceNotFoundError} if a user is not found.
 */
const updateUserById = async (id: string, user: IUser) => {
	if (!id) throw new BadRequestError("User id cannot be empty.");
	if (!user)
		throw new BadRequestError("Request body did not contain any updates!");
	let allowedFields = ["name", "email"];

	let toUpdate: any = {};

	for (const [key, value] of Object.entries(user)) {
		if (value && allowedFields.includes(key)) toUpdate[key] = value;
	}

	const updatedUser = await User.findByIdAndUpdate(
		id,
		{ $set: toUpdate },
		{ new: true }
	);

	// This should never happen, but the check was necessary for typesafety.
	if (!updatedUser)
		throw new ResourceNotFoundError("Could not update the user!");

	return updatedUser;
};

/**
 * Updates the password of an exisiting user
 * @param id A valid Object id hex string
 * @param password A valid user password (must be 6 characters or more)
 * @returns The updates user of type {@link IUser}
 * @throws A {@link ResourceNotFoundError} if a user with the id is not found.
 */
const updatePasswordById = async (id: string, password: string) => {
	const user = await User.findById(id).select("password");

	if (!user)
		throw new ResourceNotFoundError(`User with id ${id} not found!`
		);

	user.password = password;

	await user.save();

	const updatedUser = await User.findById(id);

	if (!updatedUser)
		throw new ResourceNotFoundError(`User with id ${id} not found`
		);

	return updatedUser;
};

/**
 * Deletes multiple users
 * @param idsString A comma separated list of valid object id hex strings
 * @returns The result of the delete operation
 * @throws A {@link BadRequestError} if the ids is empty/invalid
 * @throws A {@link ResourceNotFoundError} if no user's were deleted.
 */
const deleteUsersByIds = async (idsString: string) => {
	if (!idsString) throw new BadRequestError("User ids are required!");
	const ids = idsString.split(",");
	if (!ids || ids.length == 0)
		throw new BadRequestError("At least one id is required!");
	const result = await User.deleteMany({ _id: { $in: ids } });
	if (result.deletedCount == 0)
		throw new ResourceNotFoundError("No user was deleted.");
	return result;
};

/**
 * Updates the password of an exisiting user
 * @param id A valid object id hex string
 * @param oldPassword The old password of the user
 * @param newPassword The new password (must be greater than 6 chars)
 * @returns The updated user
 * @throws {@link ResourceNotFoundError} if user does not exist
 * @throws {@link UnAuthorizedError} if old password does not match the existing password
 */
const compareOldPasswordAndUpdate = async (
	id: string,
	oldPassword: string,
	newPassword: string
) => {
	const user = await User.findById(id).select("password");

	if (!user)
		throw new ResourceNotFoundError(`User with id ${id} not found!`
		);

	const isCorrectPassword = user.verifyPassword(oldPassword);

	if (!isCorrectPassword)
		throw new UnAuthorizedError("Password did not match!");

	user.password = newPassword;

	await user.save();

	return await User.findById(id);
};

/**
 * Add an amount to the user's balance
 * @param id The object id hex string of an existing user
 * @param amount The amount to add to the user's balance
 * @returns The updated user
 */
const addAmountToUserBalance = async (id: string, amount: number) => {
	return await findByIdAndUpdateBalance(id, amount);
};

/**
 * Deducts an amount from the user's balance
 * @param id The object id hex string of an existing user
 * @param amount The amount to deduct from the user's balance
 * @returns The updated user
 */
const deductAmountFromUserBalance = async (id: string, amount: number) => {
	return await findByIdAndUpdateBalance(id, -amount);
};

/**
 * Updates the balance of an existing user
 * @param id The object id hex string of an existing user
 * @param amount The amount to add (must be negative to deduct)
 * @returns The updated user
 * @throws {@link ResourceNotFoundError} if a user is not found.
 * @private Only available within this file
 */
const findByIdAndUpdateBalance = async (id: string, amount: number) => {
	const user = await getUserById(id);

	if (!user)
		throw new ResourceNotFoundError(`User with id ${id} not found!`
		);

	user.balance += amount;
	await user.save();
	const updatedUser = await getUserById(id);

	return updatedUser;
};

/**
 * Exporting all public functions as a single object
 */
export default {
	addUser,
	getUsers,
	getUserById,
	getUsersByIds,
	getUserByEmail,
	getUserByEmailWithPassword,
	updateUserById,
	updatePasswordById,
	deleteUsersByIds,
	compareOldPasswordAndUpdate,
	addAmountToUserBalance,
	deductAmountFromUserBalance
};

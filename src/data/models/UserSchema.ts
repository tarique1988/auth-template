import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
	_id: string;
	name: string;
	email: string;
	password: string;
	balance: number;
	getAuthToken(): string;
	verifyAuthToken(token: string): { id: string };
	verifyPassword(password: string): boolean;
}

const UserSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			require: [true, "Please enter a name!"]
		},
		email: {
			type: String,
			require: [true, "Please enter an email!"],
			unique: true
		},
		password: {
			type: String,
			required: [true, "Password is required!"],
			minlength: [6, "Password should be at least 6 characters"],
			select: false
		},
		balance: {
			type: Number,
			default: 0
		},
		roles: {
			type: String,
			enum: ["user"],
			default: "user"
		}
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	if (this.isNew || this.isModified("password")) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
	next();
});


UserSchema.methods.verifyPassword = async function (
	this: IUser,
	password: string
) {
	return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getAuthToken = function (this: IUser) {
	return jwt.sign(
		{ id: this._id },
		process.env.JWT_SECRET as unknown as string,
		{ expiresIn: process.env.JWT_DURATION }
	);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;

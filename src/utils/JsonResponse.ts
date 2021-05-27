import CustomError from "./CustomErrors";

export default function getJsonResponse(
	data: Object,
	message: string = "The operation succeeded.",
	success: boolean = true,
	errors: CustomError[] = []
) {
	let errorObjects = errors.map((error) => ({
		name: error.name,
		message: error.message
	}));
	return { success, data, errors: errorObjects, message };
}

import { Router } from "express";
import userController from "../controllers/users";

const router = Router();

/**
 * Routes all get requests for the base url to userController
 * @method GET
 * @private Admin only
 */
router
	.route("/")
	.get(userController.getUsers)

	/**
	 * Routes all requests for the /id/:id route:
	 * @method GET 
	 * @private	User and Admin
	 * 
	 * @method PUT
	 * @private User and Admin
	 * 
	 * @method DELETE
	 * @private Admin only
	 */
router
	.route("/id/:id")
	.get(userController.getUserById)
	.put(userController.updateUserById)
	.delete(userController.deleteUserById);

		/**
	 * Routes all requests for the /id route:
	 * @method GET
	 * @private Admin only
	 * 
	 * @method DELETE
	 * @private Admin only
	 */
router
	.route("/id")
	.get(userController.getUsersByIds)
	.delete(userController.deleteUsersByIds);

export default router;

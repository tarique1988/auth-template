import { Router } from "express";
import authController from "../controllers/auth";
const router = Router();
/**
 * Registers a new user
 * @method POST
 * @public
 */
router.post("/register", authController.register);

/**
 * Logs in a registered user
 * @method POST
 * @public
 */
router.post("/login", authController.login);

/**
 * Returns the currently logged in user
 * @method GET
 * @private Admin and User
 */
router.get("/", authController.getCurrentUser);

/**
 * Generates a password reset token
 * @method POST
 * @public
 */
router.post("/password-reset-token", authController.getPasswordResetToken);

/**
 * Verifies the password reset token and updates the password
 * @method POST
 * @public
 */
router.post("/reset-password/:token", authController.resetPassword);

export default router;

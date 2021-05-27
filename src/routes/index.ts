// this file will merge all routes into one
import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./users";

const router = Router();

/**
 * Routes all requests for /users route to the userRouter
 */
router.use("/users", userRouter);

/**
 * Routes all requests for /auth route to the authRouter
 */
router.use("/auth", authRouter);



export default router;

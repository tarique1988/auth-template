import express from "express";
import errorHandler from "./middlewares/errorHandler";
import routeHandler from "./routes/index";
import pageNotFoundHanlder from "./middlewares/404Handler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routeHandler);

app.use("*", pageNotFoundHanlder);

app.use(errorHandler);

export default app;

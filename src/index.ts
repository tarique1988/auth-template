import database from "./data/db";
import path from "path";
import dotenv from "dotenv";
import app from "./app";

if (process.env.TS_NODE_DEV)
	dotenv.config({ path: path.resolve(process.cwd(), ".env.dev") });
else dotenv.config();

database();

const port: number = parseInt(process.env.PORT as unknown as string) || 3000;

app.listen(port, () => {
	console.log(`App is live on port ${port}.`);
});

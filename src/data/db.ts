import mongoose from "mongoose";

const database = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB as unknown as string, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true
        });
        console.log("Connected to database successfully.");
    } catch (error) {
        console.error("Failed to connect to the database.");
        process.exit(2);
    }
};

export default database;

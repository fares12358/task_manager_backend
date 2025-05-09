const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {});
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("error connecting to mongoDB", err);
        process.exit(1);
    }
};
module.exports = connectDB;
const { default: mongoose } = require("mongoose")

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log('DB connected Successfully');
    }
    catch (error) {
        console.log('error occurred', error);
    }
}

module.exports = dbConnect;
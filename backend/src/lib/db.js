import mongoose from 'mongoose'

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Mongo DB connection: ${conn.connection.host}`);
    }
    catch(err) {
        console.log(err);
    }
}
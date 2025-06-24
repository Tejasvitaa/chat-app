import mongoose from "mongoose";


//function to connect to the database
export const connectDB = async () => {
    try{
        mongoose.connection.on('connected',()=>console.log('Datbase connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/ChatApp`)
    }
    catch(err) {
        console.log(err);
    }
};
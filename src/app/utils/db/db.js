
import mongoose from "mongoose";

export const DBconnection=async()=>{
    try {
        await mongoose.connect(process.env.Mongo_url)
        console.log("Data base connected succesfully")
    } catch (error) {
        console.log("error")
    }
}
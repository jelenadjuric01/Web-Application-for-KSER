import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Notification = new Schema(
    {
        _id:{
            type:ObjectId
        },
        title: {
            type: String
        },
        description:
        {
            type: String
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Array<String>(),
            default: []
        }
       
    }
);

export default mongoose.model("Notification", Notification, "notifications");




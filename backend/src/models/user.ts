import mongoose from "mongoose";

const Schema = mongoose.Schema;

let User = new Schema(
    {
       
       
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        faculty: {
            type: String
        },
        department: {
            type: String
        },
        year: { 
            type: Number
        },
        index: {
            type: String
        },
        phone: {
            type: String
        },
        country: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        type: {
            type: String
        },
        accepted: {
            type: Boolean,
            default:false
        },
        registered: {
            type: Boolean,
            default:false
        },
        room: {
            type: String,
            default:""
        },
        package: {
            type: Number,
            default:0
        }
    }
);

export default mongoose.model("User", User, "users");




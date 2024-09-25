import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Package = new Schema(
    {
        name: {
            type: String
        },
        number: {   
            type: Number
        },
        available: {
            type: Boolean,
            default:true
        }
       
    }
);

export default mongoose.model("Package", Package, "packages");




import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Country = new Schema(
    {
        name: {
            type: String
        },
        faculties: {
            type: Array<string>()
        }
       
    }
);

export default mongoose.model("Country", Country, "country");




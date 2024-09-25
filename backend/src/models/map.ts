import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Map = new Schema(
    {
        longitude: {
            type: Number
        },
        latitude: {
            type: Number
        },
        label: {
            type: String
        }
       
    }
);

export default mongoose.model("Map", Map, "map");




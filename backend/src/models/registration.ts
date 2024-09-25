import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Registration = new Schema(
    {
        openForOrganizers: {
            type: Boolean
        },
        openForParticipants: {
            type: Boolean
        },
        openForForeings: {
            type: Boolean
        }
       
    }
);

export default mongoose.model("Registration", Registration, "registration");


import mongoose from "mongoose";
import { Item } from "./item";

const Schema = mongoose.Schema;

let Agenda = new Schema(
    {
        day: {
            type: Number
        },
        items: {
            type: Array<Item>()
        }
       
    }
);

export default mongoose.model("Agenda", Agenda, "agenda");




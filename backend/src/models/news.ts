import { ObjectId, Timestamp } from 'mongodb';
import mongoose from 'mongoose'



const Schema = mongoose.Schema;

let News = new Schema({
  
   
    _id:{
        type:ObjectId
    },
            title:{
                type:String
            },
            description:{
                type:String
            },
            timestamp:{
                type:Date,
                default:Date.now
            }
    
    
})

export default mongoose.model('News', News, 'news');
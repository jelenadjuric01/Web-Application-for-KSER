import express from "express";
import Notification from "../models/notification";
import mongoose from "mongoose";




export class NotificationController {
    addNotification = (req: express.Request, res: express.Response) => {
       
            let news = new Notification({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                description: req.body.description
            });
            news.save().then(news => { res.json({ 'message': 'ok' }) }).catch(err => { res.json(err) });

    }

    deleteNotification = (req: express.Request, res: express.Response) => {
        Notification.deleteOne(
            {
                "_id": req.body._id
            }).then(notification => { res.json({ 'message': 'ok' }) }).catch(err => { res.json(err) });
    }
    updateNotification = (req: express.Request, res: express.Response) => {
        console.log(req.body);
        Notification.updateOne(
            {
                "_id": req.body._id
            },
            {
                
                    "title": req.body.title,
                    "description": req.body.description,
                    "timestamp": Date.now(),
                    "read":req.body.read
                
            }).then(news => { res.json({ 'message': 'ok' }) }).catch(err => { console.log(err); res.json(err) });
    }
    fetchAll = (req: express.Request, res: express.Response) => {
        
        Notification.find({}).sort({timestamp:-1})
        .then(notification => {
            if (notification) {
                
                res.json(notification);
            } else {
                res.status(404).json({ message: "Notification not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    fetchNotification = (req: express.Request, res: express.Response) => {
        
        Notification.findOne({"_id":req.body._id})
        .then(notification => {
            if (notification) {
                res.json(notification);
            } else {
                res.status(404).json({ message: "Notification not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

   

   
}
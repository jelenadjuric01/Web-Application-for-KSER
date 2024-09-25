import express from "express";
import News from "../models/news";
import mongoose from "mongoose";




export class NewsController {
    addNews = (req: express.Request, res: express.Response) => {
       
            let news = new News({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                description: req.body.description

            });
            news.save().then(news => { res.json({ 'message': 'ok' }) }).catch(err => { res.json(err) });

    }

    deleteNews = (req: express.Request, res: express.Response) => {
        News.deleteOne(
            {
                "_id": req.body._id
            }).then(news => { res.json({ 'message': 'ok' }) }).catch(err => { res.json(err) });
    }
    updateNews = (req: express.Request, res: express.Response) => {
        console.log(req.body);
        News.updateOne(
            {
                "_id": req.body._id
            },
            {
                
                    "title": req.body.title,
                    "description": req.body.description,
                    "timestamp": Date.now()
                    
                
            }).then(news => { res.json({ 'message': 'ok' }) }).catch(err => { console.log(err); res.json(err) });
    }
    fetchAll = (req: express.Request, res: express.Response) => {
        
        News.find({})
        .then(news => {
            if (news) {
                res.json(news);
            } else {
                res.status(404).json({ message: "News not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    fetchNews = (req: express.Request, res: express.Response) => {
        
        News.findOne({"_id":req.body._id})
        .then(news => {
            if (news) {
                res.json(news);
            } else {
                res.status(404).json({ message: "News not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

   

   
}
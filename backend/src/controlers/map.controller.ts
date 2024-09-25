import express from "express";
import Map from "../models/map";




export class MapController {
    addMark = (req: express.Request, res: express.Response) => {
        let map = new Map(req.body);
        map.save().then(map => { res.json({ 'message': 'ok' }) }).catch(err => { res.json(err) });
      
    }
    
    deleteMark = (req: express.Request, res: express.Response) => {
        Map.collection.deleteOne(
            {
                "label": req.body.label
            });
            res.json({"message":'ok'})
    }
    fetchAll = (req: express.Request, res: express.Response) => {
        
        Map.find({})
        .then(map => {
            if (map) {
                res.json(map);
            } else {
                res.status(404).json({ message: "Map not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

   

   
}
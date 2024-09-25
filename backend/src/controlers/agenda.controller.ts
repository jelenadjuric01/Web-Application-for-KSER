import express from "express";
import Agenda from "../models/agenda";




export class AgendaController {
    updateAgenda = (req: express.Request, res: express.Response) => {
        let agenda = new Agenda(req.body);
        Agenda.collection.updateOne({ 'day': agenda.day }, { $set: {'items':agenda.items} }, { upsert: true })
        .then(ag => {
            if (ag) {
                res.json({ message: "ok" });
            } else {
                res.status(404).json({ message: "Agenda not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    fetchAll = (req: express.Request, res: express.Response) => {
        
        Agenda.find({})
        .then(agenda => {
            if (agenda) {
                res.json(agenda);
            } else {
                res.status(404).json({ message: "Agenda not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

   

   
}
import express from "express";
import Registration from "../models/registration";




export class RegistrationController {
    

    fetchAll = (req: express.Request, res: express.Response) => {
        
        Registration.findOne({})
        .then(reg => {
            if (reg) {
                res.json(reg);
            } else {
                res.status(404).json({ message: "Registration not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    setForOrganizers = (req: express.Request, res: express.Response) => {
        Registration.collection.updateOne({}, { $set:{openForOrganizers: req.body.status} })
        .then(reg => {
            if (reg) {
                res.json({ message: "ok" });
            } else {
                res.status(404).json({ message: "Registration not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    setForParticipants = (req: express.Request, res: express.Response) => {
        Registration.collection.updateOne({}, { $set:{openForParticipants: req.body.status} })
        .then(reg => {
            if (reg) {
                res.json({ message: "ok" });
            } else {
                res.status(404).json({ message: "Registration not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    setForForeings = (req: express.Request, res: express.Response) => {
        Registration.collection.updateOne({}, {$set:{ openForForeings: req.body.status} })
        .then(reg => {
            if (reg) {
                res.json({ message: "ok" });
            } else {
                res.status(404).json({ message: "Registration not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

   

   
}
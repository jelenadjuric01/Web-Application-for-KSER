import express from "express";
import Package from "../models/package";




export class PackageController {
    

    fetchAll = (req: express.Request, res: express.Response) => {
        
        Package.find({})
        .then(pack => {
            if (pack) {
                res.json(pack);
            } else {
                res.status(404).json({ message: "Packages not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    updatePackage = (req: express.Request, res: express.Response) => {
        Package.collection.updateOne({'number':req.body.number}, { $set:{'available': req.body.status} })
        .then(reg => {
            if (reg) {
                res.json({ message: "ok" });
            } else {
                res.status(404).json({ message: "Package not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    

   

   
}
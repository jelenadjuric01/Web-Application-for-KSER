import express from "express";
import Country from "../models/country";

export class CountryController {
    fetchByName = (req: express.Request, res: express.Response) => {
        let name = req.body.name;
        console.log(name)
        Country.findOne({ 'name': name })
        .then(country => {
            if (country) {
                res.json(country);
            } else {
                res.status(404).json({ message: "Country not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }
    fetchAll = (req: express.Request, res: express.Response) => {
        
        Country.find({})
        .then(country => {
            if (country) {
                res.json(country);
            } else {
                res.status(404).json({ message: "Country not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }
   
}
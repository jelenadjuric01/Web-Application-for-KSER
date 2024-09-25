import express from "express";
import User from "../models/user";
import { info } from "console";


const { google } = require('googleapis');

const SERVICE_ACCOUNT_FILE = '../backend_Node/src/googlesheet/diplomski2024-3e4d4bce8263.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: SCOPES
  });

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1gi9ePmRilTzJLwUfr5YkjNsdo8ruD-05fr3lrcI1830';

var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '',
      pass: ''
    },
    tls: {
        rejectUnauthorized: false
      }
  });

export class UserController {
    
    sendNotifications = (req: express.Request, res: express.Response) => {
        let text=req.body.text;
   
    var mailOptions = {
        from: 'dj200356d@student.etf.bg.ac.rs',
        bcc: req.body.emails,
        subject: req.body.subject,
        text: text
      };
      transporter.sendMail(mailOptions).then((info: any) => {
        if (info) {
            res.json({"message":"ok"});
        } else {
            res.status(404).json({ message: "Error" });
        }
    })
    .catch((err:any) => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    });
    }

    fetchByEmail = (req: express.Request, res: express.Response) => {
        let email = req.body.email;
        console.log(email)
        User.findOne({ 'email': email })
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.json({ message: "User not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    

    addUser = async (req: express.Request, res: express.Response) => {
        let user = new User(req.body);
        console.log(user);
        const rows = [ [
            user.firstname,
            user.lastname,
            user.faculty,
            user.department,
            user.year?.toString(),
            user.index,
            user.country,
            user.email,
            user.password,
            user.type,
            user.accepted?.toString(),
            user.registered?.toString()
         ] ];
          console.log(rows);
        try {
            const response = await sheets.spreadsheets.values.append({
              spreadsheetId: SPREADSHEET_ID,
              range: 'Users!A2:L2', // Adjust the range as per your sheet
              valueInputOption: 'RAW',
              resource: {
                "values": rows,
              },
            });
            let text="Zdravo, svoj nalog potvrdi na linku http://localhost:4200/verify/"+
            req.body.email;
   
        var mailOptions = {
        from: 'dj200356d@student.etf.bg.ac.rs',
        to: req.body.email,
        subject: 'Potvrda naloga',
        text: text
      };
      transporter.sendMail(mailOptions).then((info: any) => {
        if (info) {
        } else {
            res.status(404).json({ message: "Error" });
        }
    })
    .catch((err:any) => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    });
            user.save().then(user => { res.json({ 'user added': 'ok' }) }).catch(err => { res.json(err) });
            console.log(response.data);
          } catch (error) {
            console.error(error);
            res.status(500).send('Error writing to the Google Sheet');
          }
    }


    fetchAll = (req: express.Request, res: express.Response) => {

        User.find({ "type": { $ne: "admin" }}).then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        });
    }

    acceptUser = async (req: express.Request, res: express.Response) => {
        console.log(req.body)
        try{
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `Users!A:L`,
              });
              const rows = response.data.values;
              let index = -1;
            for (let i = 0; i < rows.length; i++) {
                 const rowData = rows[i];
                 console.log(rowData[7]);
            if (rowData[7] == req.body.email) { 
                index= i + 1; 
            }
            }
            console.log(index);
            if(index==-1){
                res.status(500).json({ message: "Internal server error" });
            }
            else{
                const response = await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `Users!K${index}`,
                    valueInputOption: 'RAW', 
                    resource: {
                        "values": [['true']],
                      },
                  });
              
                  console.log('Sheet updated successfully:', response.data.updatedCells);
                    User.collection.updateOne(
                {
                    "email": req.body.email
                },
                {
                    $set: { 'accepted': true }
                });
    
            res.json({ 'message': 'ok' });
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
        


    }

    updateUser = async (req: express.Request, res: express.Response) => {
        console.log(req.body)
        try{
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `Users!A:L`,
              });
              const rows = response.data.values;
              let index = -1;
            for (let i = 0; i < rows.length; i++) {
                 const rowData = rows[i];
            if (rowData[7] == req.body.email) { 
                index= i + 1; 
            }
            }
            if(index==-1){
                res.status(500).json({ message: "Internal server error" });
            }
            else{
                const rows = [ [
                    req.body.firstname,req.body.lastname,req.body.faculty,req.body.department,
                    req.body.year?.toString(),req.body.index,req.body.country,
                    req.body.email,
                    req.body.password
                 ] ];
                const response = await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `Users!A${index}:I${index}`,
                    valueInputOption: 'RAW', 
                    resource: {
                        "values": rows,
                      },
                  });
              
                  console.log('Sheet updated successfully:', response.data.updatedCells);
                    User.collection.updateOne(
                {
                    "email": req.body.email
                },
                {
                    $set: { 'firstname': req.body.firstname,"lastname":req.body.lastname,"faculty":req.body.faculty,"department":req.body.department,"year":req.body.year,"index":req.body.index,"country":req.body.country,"password":req.body.password }
                });
    
            res.json({ 'message': 'ok' });
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
        


    }

    sendPassword = (req: express.Request, res: express.Response) => {
       
        let noErrors=true;
        let password = req.body.password;
        
    
   
    let text="Postovani, Vasa lozinka je "+password;
   
    var mailOptions = {
        from: 'dj200356d@student.etf.bg.ac.rs',
        to: req.body.email,
        subject: 'Zaboravljena lozinka',
        text: text
      };
      transporter.sendMail(mailOptions).then((info: any) => {
        if (info) {
            res.json({"message":"ok"});
        } else {
            res.status(404).json({ message: "Error" });
        }
    })
    .catch((err:any) => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    });
        
} 

    

    
    deleteUser = async (req: express.Request, res: express.Response) => {
        console.log(req.body)
        try{
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `Users!A:L`,
              });
              const rows = response.data.values;
              let index = -1;
            for (let i = 0; i < rows.length; i++) {
                 const rowData = rows[i];
                 console.log(rowData[7]);
            if (rowData[7] == req.body.email) { 
                index= i + 1; 
            }
            }
            console.log(index);
            if(index==-1){
                res.status(500).json({ message: "Internal server error" });
            }
            else{
               
                const request = {
                    spreadsheetId: SPREADSHEET_ID,
                    requestBody: {
                      requests: [
                        {
                          deleteDimension: {
                            range: {
                              sheetId: 0, 
                              dimension: 'ROWS',
                              startIndex:  index-1, // Row indices are zero-based
                              endIndex: index, // Exclusive end index
                            },
                          },
                        },
                      ],
                    },
                    auth: auth,
                  };
                  const response = await sheets.spreadsheets.batchUpdate(request);

              
                  console.log('Sheet updated successfully:', response.data);
                    User.collection.deleteOne(
                {
                    "email": req.body.email
                });
    
            res.json({ 'message': 'ok' });
            }
        

        }
        catch(err){
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
        


    }

    changeType = async (req: express.Request, res: express.Response) => {
        console.log(req.body)
        try{
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `Users!A:L`,
              });
              const rows = response.data.values;
              let index = -1;
            for (let i = 0; i < rows.length; i++) {
                 const rowData = rows[i];
                 console.log(rowData[7]);
            if (rowData[7] == req.body.email) { 
                index= i + 1; 
            }
            }
            console.log(index);
            if(index==-1){
                res.status(500).json({ message: "Internal server error" });
            }
            else{
                const rows = [ [
                    req.body.type
                 ] ];
                const response = await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `Users!J${index}`,
                    valueInputOption: 'RAW', 
                    resource: {
                        "values": rows,
                      },
                  });
              
                  console.log('Sheet updated successfully:', response.data.updatedCells);
                    User.collection.updateOne(
                {
                    "email": req.body.email
                },
                {
                    $set: { "type":req.body.type }
                });
    
            res.json({ 'message': 'ok' });
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
        


    }

    addRoommates = async (req: express.Request, res: express.Response) => {
        console.log(req.body)
        try{
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `Users!A:L`,
              });
              const rows = response.data.values;
              let index = -1;
            for (let i = 0; i < rows.length; i++) {
                 const rowData = rows[i];
                 console.log(rowData[7]);
            if (rowData[7] == req.body.email) { 
                index= i + 1; 
            }
            }
            console.log(index);
            if(index==-1){
                res.status(500).json({ message: "Internal server error" });
            }
            else{
                const response = await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `Users!L${index}:N${index}`,
                    valueInputOption: 'RAW', 
                    resource: {
                        "values": [[req.body.status.toString(),req.body.roommates,req.body.package.toString()]],
                      },
                  });

              
                  console.log('Sheet updated successfully:', response.data.updatedCells);
                  let text;
                  if(req.body.status==true){
                    text="Zdravo, uspesno si se prijavio/la za KSER 2025 za Paket broj "+req.body.package+"."+" Za sobu si stavio/la "+req.body.roommates+" .Podatke mozes da promenis na sajtu";
                    }
                    else{
                        text="Zdravo, tvoja prijava za KSER 2025 je otkazana.";
                    }
   
                    var mailOptions = {
                     from: 'dj200356d@student.etf.bg.ac.rs',
                     to: req.body.email,
                    subject: 'Prijava za KSER 2025',
                    text: text
                    };
                 transporter.sendMail(mailOptions).then((info: any) => {
                 if (!info) 
                 {
                    res.status(404).json({ message: "Error" });
                }
             })
            .catch((err:any) => {
               console.log(err);
               res.status(500).json({ message: "Internal server error" });
             });
                    User.collection.updateOne(
                {
                    "email": req.body.email
                },
                {
                    $set: { 'room': req.body.roommates , 'registered': req.body.status, 'package': parseInt(req.body.package)}
                });
    
            res.json({ 'message': 'ok' });
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
        


    }
}
import express from 'express';

export const dmRoutes = express.Router();

dmRoutes.get('/messages', messages);
dmRoutes.get('/messages/contacts', contacts);
dmRoutes.post('/messages/send', send)

// Callback funciton definitions 

import { getMessages, getContacts, sendMessage } from '../database.mjs';

async function messages(req, res) {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    const sender = req.query.sender;
    const receiver = req.query.receiver;
    console.log("get messages routes", sender, receiver);
    const messages = await getMessages(sender, receiver).catch(console.dir);
    res.send(JSON.stringify(messages));
};

async function contacts(req, res) {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    console.log("get contacts", req.query.senter);
    const data = await getContacts(req.query.sender).catch(console.dir);
    res.send(JSON.stringify(data));
}

async function send(req, res)  {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    console.log(req.body);
    sendMessage(req.body).catch(console.dir)
}

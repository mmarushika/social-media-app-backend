import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from "express-fileupload";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl

import {getMessages, sendMessage, getPosts, makePost, getDMList} from "./database.mjs"

const app = express();
const port = 8000;

app.use(fileUpload());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.post("/post", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    console.log(req.body);
    makePost(req.body).catch(console.dir)
})

app.get('/image', async (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
    });
    console.log(req.query.filepath);
    res.sendFile(req.query.filepath, () => {
        console.log("sent");
    });
});
app.post('/upload', function(req, res) {
    let uploadPath;
  
    /*if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }*/
    res.set({
        "Access-Control-Allow-Origin": "*",
    });

    const file = req.files.file;
    uploadPath = __dirname + "/images/posts/" + file.name;
    console.log(uploadPath);
  
    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function(err) {
      console.log("uploaded");
    });
  });

app.get("/messages", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    const sender = req.query.sender;
    const receiver = req.query.receiver;
    const messages = await getMessages(sender, receiver).catch(console.dir);
    //console.log(messages);
    res.send(JSON.stringify(messages));
});

app.get("/posts", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getPosts().catch(console.dir);
    res.send(JSON.stringify(data));
    /*getPosts().catch(console.dir)
        .then(
            (posts) => res.send(JSON.stringify(posts))
        )*/
})

app.get("/dm-list", async(req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getDMList(req.query.sender).catch(console.dir);
    res.send(JSON.stringify(data));
})

app.post("/send", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    console.log(req.body);
    sendMessage(req.body).catch(console.dir)
})

app.listen(port, () => {
    console.log(`listening on ${port}`);
})

app.use(cors({origin: true, credentials:true}));
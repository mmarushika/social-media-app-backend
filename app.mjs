import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from "express-fileupload";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl

import {getMessages, getProfile, getPosts, getDMList, getUsers} from "./database.mjs"
import {sendMessage, makePost, addProfile, addSettings} from "./database.mjs";
import {authenticate, signup} from "./database.mjs";

const app = express();
const port = 8000;

app.use(fileUpload());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Auth

app.get("/auth", async(req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    console.log(username, password);
    const valid = await authenticate(username, password).catch(console.dir);
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    res.send(JSON.stringify({isAuthenticated : valid}));
});

app.post("/signup", async(req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    signup(req.body).catch(console.dir);
});

// Users
app.get("/users", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getUsers().catch(console.dir);
    res.send(JSON.stringify(data));
});


// Posts 
app.get("/posts", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getPosts(req.query.username).catch(console.dir);
    console.log("posts", data);
    res.send(JSON.stringify(data));
    /*getPosts().catch(console.dir)
        .then(
            (posts) => res.send(JSON.stringify(posts))
        )*/
});

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
    if(req.query.filepath !== "") {
        res.sendFile(req.query.filepath, () => {
            //console.log("sent", req.query.filepath);
        });
    } else {
        res.end();
    }
});
app.post('/upload/posts', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "*",
    });

    const file = req.files.file;
    const uploadPath = __dirname + "/assets/posts/" + file.name;
    console.log(uploadPath);
  
    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function(err) {
      console.log("uploaded");
    });
  });

  app.post('/upload/profiles', function(req, res) {
    res.set({
        "Access-Control-Allow-Origin": "*",
    });

    const file = req.files.file;
    const uploadPath = __dirname + "/assets/profiles/" + file.name;
    console.log("upload path" ,uploadPath);
  
    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function(err) {
      console.log("uploaded");
    });
  });

// Messages

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

// Profile

app.get("/profile", async(req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    const profile = await getProfile(req.query.username);
    //console.log("profile", profile);
    res.send(JSON.stringify(profile));
});


app.post("/new-profile", async(req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    //console.log(req.body);
    addProfile(req.body.profile).catch(console.dir);
    addSettings(req.body.settings).catch(console.dir);
});


app.listen(port, () => {
    console.log(`listening on ${port}`);
})

app.use(cors({origin: true, credentials:true}));
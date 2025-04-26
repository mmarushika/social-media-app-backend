import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from "express-fileupload";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl

import { authenticate, signup, getUsers} from "./database.mjs";
//import { getMessages, getDMList, sendMessage } from "./database.mjs";
import { getPosts, getComments, makePost, makeComment } from "./database.mjs";
import { getProfile, getSettings, addProfile, addSettings} from "./database.mjs";
import { getFollowers, getFollowing, requestFollow, cancelFollowRequest,
     acceptFollowRequest, cancelFollow, getFollowStatus, getFollowRequests, getFollowsRequested } from "./database.mjs"

const app = express();
const port = 8000;

app.use(fileUpload());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors({origin: true, credentials:true}));

import { dmRoutes } from './routes/dmRoutes.mjs';
app.use(dmRoutes)

// Auth

app.get("/auth", async(req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    //console.log(username, password);
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

// Follow  

app.get("/followers", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getFollowers(req.query.username).catch(console.dir);
    res.send(JSON.stringify(data));
});

app.get("/following", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getFollowing(req.query.username).catch(console.dir);
    //console.log(data);
    res.send(JSON.stringify(data));
});

app.get("/followers/mutual", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const followers = await getFollowers(req.query.username).catch(console.dir);
    const following = await getFollowing(req.query.username).catch(console.dir);
    const data = followers.filter(i => following.includes(i));
    res.send(JSON.stringify(data));
});

app.get("/follow/requests", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getFollowRequests(req.query.username).catch(console.dir);
    res.send(JSON.stringify(data));
});

app.get("/follow/requested", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getFollowsRequested(req.query.username).catch(console.dir);
    res.send(JSON.stringify(data));
});

app.get("/follow/status", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    //console.log(req.query.user, req.query.viewer);
    const data = await getFollowStatus(req.query.user, req.query.viewer).catch(console.dir);
    //console.log("follow status", data);
    res.send(JSON.stringify(data));
});

app.post("/follow/request", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    requestFollow(req.body).catch(console.dir);
});

app.post("/follow/request/cancel", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    //console.log(req.body);
    cancelFollowRequest(req.body).catch(console.dir);
});

app.post("/follow/request/accept", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    acceptFollowRequest(req.body).catch(console.dir);
});

app.post("/follow/cancel", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    cancelFollow(req.body).catch(console.dir);
});

// Posts 
app.get("/posts", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getPosts(req.query.username).catch(console.dir);
    //console.log("posts", data);
    res.send(JSON.stringify(data));
    /*getPosts().catch(console.dir)
        .then(
            (posts) => res.send(JSON.stringify(posts))
        )*/
});
app.get("/posts/all", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getPosts("").catch(console.dir);
    //console.log("posts", data);
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
    //console.log(req.body);
    makePost(req.body).catch(console.dir)
})

// Comments

app.get("/comments", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const data = await getComments(req.query.post_id).catch(console.dir);
    res.send(JSON.stringify(data));
});

app.post("/comment", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    console.log(req.body);
    makeComment(req.body).catch(console.dir)
})

// Send and Upload Images

app.get('/image', async (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
    });
    //console.log(req.query.filepath);
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
    //console.log(uploadPath);
  
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
    //console.log("upload path" ,uploadPath);
  
    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function(err) {
      console.log("uploaded");
    });
  });

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

app.get("/profile/settings", async(req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    const profile = await getSettings(req.query.username);
    //console.log("profile", profile);
    res.send(JSON.stringify(profile));
});


app.post("/profile/new", async(req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    console.log(req.body);
    addProfile(req.body.profile).catch(console.dir);
    addSettings(req.body.settings).catch(console.dir);
});


app.listen(port, () => {
    console.log(`listening on ${port}`);
})


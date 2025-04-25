import { MongoClient } from "mongodb";


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

/*export async function getImageFilepath(id) {
    try {
        const db = client.db("test");
        const result = await db.collection("posts").findOne({_id : `{id}`});
        console.log(result);
        return result.imageFilepath;
    } finally {
        //await client.close();
    }
}*/

// Authentication 
export async function authenticate(username, password) {
    try {
        const db = client.db("test");
        const auth = db.collection("auth");
        const res = await auth.findOne({username : username});
        //console.log(res.password);
        return res.password === password;
    } catch {
        console.log("error");
    }
}
export async function signup(data) {
    try {
        const db = client.db("test");
        const auth = db.collection("auth");
        auth.insertOne(data);
    } catch {
        console.log("error");
    }
}

// Users

export async function getUsers() {
    try {
        //console.log("dm=list");
        const db = client.db("test");
        const result = await db.collection("auth").distinct("username");
        //console.log("users", result)
        return result;
    } finally {
        //await client.close();
    }
}

// Follow

export async function getFollowers(username) {
    try {
        const db = client.db("test");
        const result = await db.collection("follows").distinct(
            "follower", 
            {account: username}
        )
        return result;
    } finally {
        //await client.close();
    }
}

export async function getFollowing(username) {
    try {
        const db = client.db("test");
        const result = await db.collection("follows").distinct(
            "account", 
            {follower: username}
        )
        console.log(result);
        return result;
    } finally {
        //await client.close();
    }
}

export async function getFollowRequests(username) {
    try {
        const db = client.db("test");
        const result = await db.collection("requests").distinct(
            "requester", 
            {account: username}
        )
        //console.log("follows requests", result);
        return result;
    } finally {
        //await client.close();
    }
}

export async function getFollowsRequested(username) {
    try {
        const db = client.db("test");
        const result = await db.collection("requests").distinct(
            "account", 
            {requester: username}
        )
        //console.log("follows requested", result);
        return result;
    } finally {
        //await client.close();
    }
}

export async function getFollowStatus(user, viewer) {
    try {
        const db = client.db("test");
        const followsResult = await db.collection("follows").findOne(
            { account : user, follower : viewer });
        const requestsResult = await db.collection("requests").findOne(
            { account : user, requester : viewer });
        //console.log(user, viewer);
        //console.log(followsResult, requestsResult);
        if(followsResult != null) {
            return {status : "Unfollow"}
        } else if(requestsResult != null) {
            return {status : "Requested"}
        } else {
            return {status : "Follow"}
        }
    } finally {
        //await client.close();
    }
}
export async function requestFollow(data) {
    try {
        const db = client.db("test");
        const requests = db.collection("requests");
        requests.insertOne(data);
    } finally {
        //await client.close();
    }
}
export async function cancelFollowRequest(data) {
    try {
        const db = client.db("test");
        const requests = db.collection("requests");
        //console.log(data);
        requests.deleteOne(data);
    } finally {
        console.log("deleted");
        //await client.close();
    }
}
export async function acceptFollowRequest(data) {
    try {
        const db = client.db("test");
        const requests = db.collection("requests");
        const follows = db.collection("follows");
        //console.log(data);
        requests.deleteOne(data).then(
            console.log("removed request")
        )
        data = {account : data.account, follower : data.requester};
        //console.log(data);
        follows.insertOne(data).then(
            console.log("followed")
        )
        console.log("accepted follow request");
    } finally {
        //await client.close();
    }
}

export async function cancelFollow(data) {
    try {
        const db = client.db("test");
        const follows = db.collection("follows");
        follows.deleteOne(data);
    } finally {
        //await client.close();
    }
}

// Messages 

export async function sendMessage(data) {
    try {
        const db = client.db("test");
        const messages = db.collection("messages");
        //console.log(data);
        messages.insertOne(data);
    } finally {
        //await client.close();
    }
}
export async function getMessages(sender, receiver) {
    try {
        const db = client.db("test");
        const messages = db.collection("messages");
        const cursor = messages.find(
            {$or: [
                {
                    sender: sender,
                    receiver: receiver
                }, 
                {   
                    sender: receiver , 
                    receiver: sender
                }
            ]}
        );
        const result = await cursor.toArray();
        /*for await (const doc of cursor) {
            result.push(doc);
        }*/
        console.log("get messages db", sender, receiver, result);
        return result;
    } finally {
        //await client.close();
    }
}

export async function getContacts(sender) {
    try {
        const db = client.db("test");
        const result = await db.collection("messages").distinct(
            "receiver", 
            {sender: sender}
        )
        //console.log(sender);
        //console.log(result);
        return result;
    } finally {
        //await client.close();
    }
}

// Posts 
export async function makePost(data) {
    try {
        data.imageFilepath =  __dirname + "/assets/posts/" + data.imageFilepath;
        //console.log(data.imageFilepath);
        const db = client.db("test");
        const messages = db.collection("posts");
        messages.insertOne(data);
    } finally {
        //await client.close();
    }
}

export async function getPosts(username) {
    try {
        const db = client.db("test");
        const posts = db.collection("posts");
        const result = [];
        let cursor = null;
        if(username === "") {
            cursor = posts.find({}); // all posts
        } else {
            cursor = posts.find({creator : username }); // creator
        }
        for await (const doc of cursor) {
            result.push(doc);
        }
        //console.log(username, result);
        return result;
    } finally {
        //await client.close();
    }
}

// Profile 

export async function getProfile(username) {
    try {
        const db = client.db("test");
        const profiles = db.collection("profiles");
        const result = await profiles.findOne({username : username});
        return result;
    } finally {
        //await client.close();
    }
}

export async function getSettings(username) {
    try {
        const db = client.db("test");
        const settings = db.collection("settings");
        const result = await settings.findOne({username : username});
        return result;
    } finally {
        //await client.close();
    }
}

export async function addProfile(data) {
    data.imageFilepath =  __dirname + "/assets/profiles/" + data.imageFilepath;
    //console.log(data);
    try {
        const db = client.db("test");
        const profiles = db.collection("profiles");
        const result = [];
        profiles.insertOne(data);
    } finally {
        //await client.close();
    }
}

export async function addSettings(data) {
    //console.log(data);
    try {
        const db = client.db("test");
        const settings = db.collection("settings");
        const result = [];
        settings.insertOne(data);
    } finally {
        //await client.close();
    }
}
export async function editProfile(profile) {

}


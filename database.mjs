import { MongoClient } from "mongodb";


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

export async function getImageFilepath(id) {
    try {
        const db = client.db("test");
        const result = await db.collection("posts").findOne({_id : `{id}`});
        console.log(result);
        return result.imageFilepath;
    } finally {
        //await client.close();
    }
}

export async function sendMessage(data) {
    try {
        const db = client.db("test");
        const messages = db.collection("messages");
        messages.insertOne(data);
    } finally {
        //await client.close();
    }
}
export async function getMessages() {
    try {
        const db = client.db("test");
        const messages = db.collection("messages");
        const result = [];
        const cursor = messages.find({});
        for await (const doc of cursor) {
            result.push(doc);
        }
        return result;
    } finally {
        //await client.close();
    }
}

export async function makePost(data) {
    try {
        data.imageFilepath =  __dirname + "/images/posts/" + data.imageFilepath;
        const db = client.db("test");
        const messages = db.collection("posts");
        messages.insertOne(data);
    } finally {
        //await client.close();
    }
}

export async function getPosts() {
    try {
        const db = client.db("test");
        const messages = db.collection("posts");
        const result = [];
        const cursor = messages.find({});
        for await (const doc of cursor) {
            result.push(doc);
        }
        return result;
    } finally {
        //await client.close();
    }
}

export async function getDMList(sender) {
    try {
        console.log("dm=list");
        const db = client.db("test");
        const result = await db.collection("messages").distinct(
            "receiver", 
            {sender: sender}
        )
        return result;
    } finally {
        //await client.close();
    }
}


import { MongoClient } from "mongodb";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

app.get("/messages", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    const messages = await getMessages().catch(console.dir);
    //console.log(messages);
    res.send(JSON.stringify(messages));
});

app.post("/send", async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    console.log(req.body);
    sendMessage(req.body).catch(console.dir)
})


async function sendMessage(data) {
    try {
        const db = client.db("test");
        const messages = db.collection("messages");
        messages.insertOne(data);
    } finally {
        //await client.close();
    }
}
async function getMessages() {
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
app.listen(port, () => {
    console.log(`listening on ${port}`);
})

app.use(cors({origin: true, credentials:true}));
import { MongoClient } from "mongodb";
// Run this program to insert message documents into collections
// Collections : messages, posts => locally create these two collections

run().catch(console.dir);

async function run() {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);
    const db = client.db("test");
    const messages = db.collection("messages");
    await messages.insertMany([
        {
          "sender": "Alice",
          "receiver": "Hannah",
          "content": "Hey Hannah, how are you?",
          "timestamp": "2025-04-06T10:15:00Z"
        },
        {
          "sender": "Hannah",
          "receiver": "Alice",
          "content": "Hi Alice! I'm good, thanks. You?",
          "timestamp": "2025-04-06T10:16:00Z"
        },
        {
          "sender": "Alice",
          "receiver": "Hannah",
          "content": "Doing well! Want to catch up later?",
          "timestamp": "2025-04-06T10:17:00Z"
        },
        {
          "sender": "Hannah",
          "receiver": "Alice",
          "content": "Sure, let’s meet at 4 PM.",
          "timestamp": "2025-04-06T10:18:00Z"
        },
        {
          "sender": "Alice",
          "receiver": "Bob",
          "content": "Hey Bob, how are you?",
          "timestamp": "2025-04-06T10:15:00Z"
        },
        {
          "sender": "Bob",
          "receiver": "Alice",
          "content": "Hi Alice! I'm good, thanks. You?",
          "timestamp": "2025-04-06T10:16:00Z"
        },
        {
          "sender": "Alice",
          "receiver": "Bob",
          "content": "Doing well! Want to catch up later?",
          "timestamp": "2025-04-06T10:17:00Z"
        },
        {
          "sender": "Hannah",
          "receiver": "Alice",
          "content": "Sure, let’s meet at 4 PM.",
          "timestamp": "2025-04-06T10:18:00Z"
        }
      ]);
    const cursor = messages.find({});
    for await (const doc of cursor) {
      console.log(doc);
    }
  } finally {
    //await client.close();
  }
}

/*
async function getDMList(sender) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    console.log(sender);
    const db = client.db("test");
    db.collection("messages").distinct(
      "receiver",
      { sender: sender }
    ).then(
      data => console.log(data)
    )
    let result = [];
    for await (const doc of cursor) {
        result.push(doc);
    }
    console.log(result);
    return result;
  } finally {
    //await client.close();
  }
}
*/
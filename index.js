require('dotenv').config() 
const express = require('express'); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express(); const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
 app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gpepkvl.mongodb.net/?retryWrites=true&w=majority`;
//console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
    client.connect();
    console.log("DB Connected Successfully ✅");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

const coffeeCollection = client.db("CoffeeShop").collection("coffee");
const userCollection = client.db("CoffeeShop").collection("user");

app.get("/", (req, res) => {
  res.send("This is an coffee events ");
});
//------------------------------user collection ------------------------------------------------------------
app.post("/user", async (req, res) => {
  const user = req.body;

  const result = await userCollection.insertOne(user);
  res.send(result);
});

app.get("/user", async (req, res) => {
  const user = userCollection.find();
  const result = await user.toArray();
  res.send(result);
});

app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  const newUser = { _id: new ObjectId(id) };
  const result = await userCollection.deleteOne(newUser);
  res.send(result);
});

app.patch("/user", async (req, res) => {
  const user = req.body;
  console.log(user);
  const filter = { email: user.email };
  const update = {
    $set: {
      lastSingIn: user.lastSingIn,
    },
  };
  const result = await userCollection.updateOne(filter, update);
  res.send(result);
});
//--------------------------------------------coffee collection ---------------------------------------------------
app.get("/coffee", async (req, res) => {
  const cursor = coffeeCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.put("/coffee/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const option = { upsert: true };
  const updateDoc = req.body;
  const up = {
    $set: {
      photo: updateDoc.photo,
      supplier: updateDoc.supplier,

      category: updateDoc.category,
      name: updateDoc.name,
      chef: updateDoc.chef,
      taste: updateDoc.taste,
      details: updateDoc.details,
    },
  };
  const update = await coffeeCollection.updateOne(query, up, option);
  res.send(update);
});

app.post("/coffee", async (req, res) => {
  const newCoffee = req.body;

  const result = await coffeeCollection.insertOne(newCoffee);
  res.send(result);
});
app.delete("/coffee/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await coffeeCollection.deleteOne(query);
  res.send(result);
});

app.get("/coffee/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await coffeeCollection.findOne(query);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

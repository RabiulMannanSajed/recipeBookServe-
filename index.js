const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z68se.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; // ` this is use to daynamic somthig `

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const usersCollection = client.db("rBook").collection("users");
    const addRecipesCollection = client.db("rBook").collection("addRecipe");

    //  this is get
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    //  this is post method
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //! this part is for Recipe add, delete, read and update
    app.post("/addRecipes", async (req, res) => {
      const recipe = req.body;
      console.log(recipe);
      const result = await addRecipesCollection.insertOne(recipe);
      res.send(result);
    });

    app.get("/addRecipes", async (req, res) => {
      const result = await addRecipesCollection.find().toArray();
      res.send(result);
    });

    app.delete("/addRecipes/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const filter = { _id: new ObjectId(id) };
      const result = await addRecipesCollection.deleteOne(filter);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("EDUSystem is open  ");
});

app.listen(port, () => {
  console.log(`EDUSystem is running Port ${port}`);
});

// crud
// c=> create = post
// r => read = get
//!u => update = patch

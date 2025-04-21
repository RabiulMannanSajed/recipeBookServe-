const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z68se.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; // ` this is use to daynamic somthig `

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

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const userInfo = req.body;
      try {
        const user = await usersCollection.findOne({ email });

        if (!user) {
          console.log("user not found ");
          return res.status(400).send({ error: "User not found" });
        }

        if (user.password !== password) {
          console.log("pass not  found ");

          return res.status(400).send({ error: "Incorrect password" });
        }

        res.send({
          message: "Login successful",
          name: user.name,
          email: user.email,
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ error: "Server error" });
      }
    });

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

    app.patch("/addRecipes/:id", async (req, res) => {
      const { id } = req.params;
      const { name, recipeName, recipeDetails } = req.body;
      console.log(id, name, recipeDetails, recipeName);
      try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            recipeName,
            recipeDetails,
          },
        };

        const result = await addRecipesCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).send("Recipe not found");
        }

        res.send({ message: "Recipe updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.delete("/addRecipes/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const filter = { _id: new ObjectId(id) };
      const result = await addRecipesCollection.deleteOne(filter);
      res.send(result);
    });

    // update part here

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Rbook is open  ");
});

app.listen(port, () => {
  console.log(`Rbook is running Port ${port}`);
});

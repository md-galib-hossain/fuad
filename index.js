const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.az94fyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const db = client.db("Fuad");
    const skills = db.collection("skillsCollection");
    const projects = db.collection("projectsCollection");
    const blogs = db.collection("blogCollection");
    const contact = db.collection("contactCollection");

    //post skills
    app.post("/create-skills", async (req, res) => {
      const addSkill = req.body;
      const result = await skills.insertOne(addSkill);
      res.send(result);
    });

    //get all skills
    app.get("/skills", async (req, res) => {
      const result = await skills.find().toArray();
      res.send(result);
    });

    //get single skill by id
    // app.get("/skills/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await skills.findOne(query);
    //   res.send(result);
    // });

    //delete an skill
    app.delete("/skills/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await skills.deleteOne(query);
      res.send(result);
    });

    //update skills
    app.put("/skills/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateSkill = req.body;
      const skillData = {
        $set: {
          title: updateSkill.title,
        },
      };
      const result = await skills.updateOne(filter, skillData, options);
      res.send(result);
    });

    //post projects
    app.post("/create-projects", async (req, res) => {
      const addProjects = req.body;
      const result = await projects.insertOne(addProjects);
      res.send(result);
    });

    //get all projects
    app.get("/projects", async (req, res) => {
      const result = await projects.find().toArray();
      res.send(result);
    });

    //post blog
    app.post("/create-blog", async (req, res) => {
      const addBlog = req.body;
      const result = await blogs.insertOne(addBlog);
      res.send(result);
    });

    // get skills
    app.get("/blogs", async (req, res) => {
      const result = await blogs.find().toArray();
      res.send(result);
    });

    //post contact
    app.post("/create-contact", async (req, res) => {
      const addContact = req.body;
      const result = await contact.insertOne(addContact);
      res.send(result);
    });

    // get contact
    app.get("/contact", async (req, res) => {
      const result = await contact.find().toArray();
      res.send(result);
    });

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
  res.send("Hello Fuad!!!");
});

app.listen(port, () => {
  console.log(`Fuad is running on port ${port}`);
});

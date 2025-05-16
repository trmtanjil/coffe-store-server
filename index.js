const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
 
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
 
 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@trmcamp0.7libfgs.mongodb.net/?retryWrites=true&w=majority&appName=trmcamp0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
 
    const coffesCollection = client.db('coffesDB').collection('coffes');
    const usersCollection = client.db('coffesDB').collection('users')

    app.get('/coffes', async(req, res)=>{
      const result =await coffesCollection.find().toArray()
      res.send(result)
    })

    app.get('/coffes/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffesCollection.findOne(query);
      res.send(result)
    })

    app.post('/coffes', async(req,res) =>{
      const newCoffe =req.body;
      console.log(newCoffe)
    const result = await coffesCollection.insertOne(newCoffe);
    res.send(result)
    
    })

    app.put('/coffes/:id', async(req,res)=>{
      const id = req.params.id;
      const filter= {_id: new ObjectId(id)}
       const options = { upsert: true };
       const updatedCoffe = req.body;
       const updatedDoc = {
        $set:updatedCoffe
       }
       const result = await coffesCollection.updateOne(filter ,updatedDoc, options)
       res.send(result)

    })

    app.delete('/coffes/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id)}
      const result = await coffesCollection.deleteOne(query)
       res.send(result);
       console.log(result)
    })

//users related APIS
    app.post('/users', async(req,res)=>{
      const usersProfile = req.body;
      console.log(usersProfile)
      const result = await usersCollection.insertOne(usersProfile);
      res.send(result)
    })
     



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


 

app.get('/', (req, res)=>{
   res.send(' coffee server is getting hotter')
})


app.listen(port,()=>{
    console.log(`coffe server is runnig on port ${port}`)
})
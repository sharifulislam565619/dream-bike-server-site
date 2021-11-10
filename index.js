const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2wssq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
   try {
      await client.connect();
      const database = client.db("dream-bike");
      const productCollection = database.collection("products");

      // const database2 = client.db("allOrder");
      // const orders = database2.collection("orders");

      // insert one product
      app.post("/addProduct", async (req, res) => {
         const data = req.body;
         const doc = {

            name: data.name,
            description: data.description,
            price: data.price,
            img: data.img
         }
         const result = await productCollection.insertOne(doc);
         res.json(result)
         console.log(result)


      })




   } finally {
      // await client.close()
   }
}
run().catch(console.dir)



app.get('/', (req, res) => {
   res.send("Dream bike is running");
})

app.listen(port, () => {
   console.log("Running port is", port);
})
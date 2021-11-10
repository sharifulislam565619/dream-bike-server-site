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
      const orderCollection = database.collection("orders");

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

      // get all products 
      app.get('/products', async (req, res) => {
         const result = await productCollection.find({}).toArray()
         res.json(result);
      })

      // // get all orders data
      // app.get("/manageOrders", async (req, res) => {

      //    const cursor = await orders.find({}).toArray();
      //    res.send(cursor)

      // })

      // // get MyOrders
      // app.get("/myOrders/:email", async (req, res) => {
      //    const result = await orders.find({
      //       email: req.params.email,
      //    }).toArray();
      //    res.send(result);
      // });

      // // update status
      // app.put("/status/:id", async (req, res) => {

      //    const id = req.params.id
      //    const filter = { _id: ObjectId(id) };
      //    const options = { upsert: true };
      //    const updateDoc = {
      //       $set: {
      //          status: req.body.status
      //       },
      //    };
      //    const result = await orders.updateOne(filter, updateDoc, options);
      //    res.json(result)


      // })

      // // delete orders
      // app.delete("/delete/:id", async (req, res) => {
      //    const id = req.params.id;
      //    const query = { _id: ObjectId(id) }
      //    const result = await orders.deleteOne(query)
      //    res.json(result)
      //    console.log(result);
      // })

      // get single product
      app.get('/product/:id', async (req, res) => {
         const id = req.params.id
         const query = { _id: ObjectId(id) };
         const result = await productCollection.findOne(query);
         res.json(result);
      })



      // Order product
      app.post("/order", async (req, res) => {
         const data = req.body;
         const doc = {
            order_id: data.order_id,
            name: data.name,
            emailAddress: data.emailAddress,
            phone: data.phone,
            status: data.status,
            address: data.address,
            email: data.email,
            img: data.img,
            price: data.price,
            orderName: data.orderName,
         }
         const result = await orderCollection.insertOne(doc);
         res.json(result)
         console.log(result);
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
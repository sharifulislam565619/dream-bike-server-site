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
      const userCollection = database.collection("users")
      const reviewCollection = database.collection("review")

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

      // insert a user review
      app.post("/review", async (req, res) => {
         const data = req.body;
         console.log(data)
         const doc = {
            email: data.email,
            name: data.name,
            description: data.description,
            photoUrl: data.photoURL,
            rating: data.rating
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

      // get all orders data
      app.get("/manageOrders", async (req, res) => {

         const cursor = await orderCollection.find({}).toArray();
         res.send(cursor)

      })

      //get user
      app.get("/users/:email", async (req, res) => {
         const email = req.params.email
         const filter = { email: email }
         const result = await userCollection.findOne(filter)
         let isAdmin = false
         if (result.role === "admin") {
            isAdmin = true
         }
         res.json({ admin: isAdmin })
      })

      // user collection
      app.post("/users", async (req, res) => {
         const user = req.body;
         const result = await userCollection.insertOne(user);
         res.json(result)
         console.log(result)
      })
      app.put("/users", async (req, res) => {
         const user = req.body;
         const filter = { email: user.email }
         const option = { upsert: true }
         const updateDoc = { $set: user };
         const result = await userCollection.updateOne(filter, updateDoc, option);
         res.json(result)
         console.log(result)
      })

      // update status
      app.put("/status/:id", async (req, res) => {
         const id = req.params.id
         const filter = { _id: ObjectId(id) };
         const options = { upsert: true };
         const updateDoc = {
            $set: {
               status: req.body.status
            },
         };
         const result = await orderCollection.updateOne(filter, updateDoc, options);
         res.json(result)
      })

      //make a new admin
      app.put("/admin/:email", async (req, res) => {
         const email = req.params.email
         const filter = { email: email };
         const updateDoc = {
            $set: {
               role: "admin"
            },
         };
         const result = await userCollection.updateOne(filter, updateDoc);
         res.json(result)
      })


      // get MyOrders
      app.get("/myOrders/:email", async (req, res) => {
         const result = await orderCollection.find({
            email: req.params.email,
         }).toArray();
         res.send(result);
      });


      // delete orders
      app.delete("/deleteOrder/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) }
         const result = await orderCollection.deleteOne(query)
         res.json(result)
      })


      // delete products
      app.delete("/deleteProduct/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) }
         const result = await productCollection.deleteOne(query)
         res.json(result)
      })

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
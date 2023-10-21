const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.meftkqt.mongodb.net/?retryWrites=true&w=majority`;

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

    const brandCollection = client.db("brandDB").collection("brand");
    const productsCollection = client.db("brandDB").collection("products");
    const userCollection = client.db("brandDB").collection("users");
    const cartCollection = client.db("brandDB").collection("cart");

    // products data
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await productsCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateProduct = req.body;

      const product = {
          $set: {
            productName: updateProduct.productName,
            brandName: updateProduct.brandName,
            ProductType: updateProduct.ProductType,
            Price: updateProduct.Price,
            rating: updateProduct.rating,
            picture: updateProduct.picture,
          }
      }

      const result = await productsCollection.updateOne(filter, product, options);
      res.send(result);
      console.log(result)
  })

    // Brands data
    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    });

    // user related apis
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
  })

  app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
  });

  app.patch('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email }
      const updateDoc = {
          $set: {
            uid: user.uid,
            lastLoggedAt: user?.lastLoggedAt,
          }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
      console.log(result)
  })

      // cart related apis
      app.get('/cart', async (req, res) => {
        const cursor = cartCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
  
    app.post('/cart', async (req, res) => {
        const newItem = req.body;
        console.log(newItem);
        const result = await cartCollection.insertOne(newItem);
        res.send(result);
        console.log(result);
    });
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
      console.log(result);
  })
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
  res.send("Turbo Tide server is running");
});

app.listen(port, () => {
  console.log(`Turbo Tide server is running on port: ${port}`);
});

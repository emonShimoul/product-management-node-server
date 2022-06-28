const express = require('express');
const app = express();
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user: mydbuser1
// pass: 5GTBgBhpP8tye52q

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mydbuser1:5GTBgBhpP8tye52q@cluster0.pabg0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("productsDb");
        const productsCollection = database.collection("products");
        console.log("hitting the database");

        // POST API
        app.post('/products', async(req, res) => {
            const product = req.body;
            // console.log(product);
            const result = await productsCollection.insertOne(product);
            console.log("product inserted -", result);
            res.json(result);
        })

        // GET API
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const productsDetails = await cursor.toArray(); 
            res.json(productsDetails);
        })

        // DELETE API
        app.delete('/products/:id', async(req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id:ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            console.log("deleted successfully", result);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Node!!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
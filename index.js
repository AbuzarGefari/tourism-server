const express = require('express');
const app = express();
require('dotenv').config()

const cors=require('cors')
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

const ObjectId = require('mongodb').ObjectId;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7poyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log('conncet')
      const database = client.db('tour-travel');
      const serviceCollection = database.collection('services');
      const orderServiceCollection = database.collection('addOrders')

  // GET API SERVICES DATA__
  app.get('/services', async(req, res)=> {
    const cursor = serviceCollection.find({});
    const services = await cursor.toArray();
    res.send(services)
})
app.get('/addOrders', async(req, res)=> {
    const cursor = orderServiceCollection.find({});
    const orderService = await cursor.toArray();
    res.send(orderService)
})
// GET API EVERY SINGLE SERVICE of SERVICES __
app.get('/services/:id', async(req, res)=> {
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const service = await serviceCollection.findOne(query);
    res.json(service);
})
// POST API SERVICES DATA__
app.post('/services', async(req, res)=> {
    const service = req.body;
    const result = await serviceCollection.insertOne(service);
    res.json(result);
    
})

// Add ORDER SERVICE POST
app.post('/addOrders', async (req, res)=> {
    const order = req.body;
   const result = await orderServiceCollection.insertOne(order);
   res.send(result);
})
}

 finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('My CURD server')
});
app.listen(port,()=>{
    console.log('server running',port)
});
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.fkijv.mongodb.net:27017,cluster0-shard-00-01.fkijv.mongodb.net:27017,cluster0-shard-00-02.fkijv.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-7hlah8-shard-0&authSource=admin&retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

const port = 5000

app.get('/', (req, res)=>{
  res.send('working')
})


MongoClient.connect(uri, function(err, client) {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

console.log('connect');

  app.post('/addProduct', (req, res) => {
      const products = req.body;

      productsCollection.insertOne(products)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount);
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })


  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
  })
 

 app.post('/productsByKeys', (req, res)=>{
   const productKeys = req.body;
   productsCollection.find({key: {$in: productKeys}})
   .toArray((err,documents)=>{
    res.send(documents);
   })
  
 })


 app.post('/addOrder', (req, res) => {
  const order = req.body;

  ordersCollection.insertOne(order)
  .then(result => {
  
    res.send(result);
  })
})


});


app.listen(process.env.PORT || port)
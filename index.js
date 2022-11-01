const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@simplebank.ciq5fuj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const accountsCollection = client
      .db('account_management')
      .collection('balances');

    app.get('/account', async (req, res) => {
      const query = {};
      const cursor = accountsCollection.find(query);
      const accounts = await cursor.toArray();
      res.send(accounts);
    });

    app.patch('/account/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const update = req.body;
      console.log(update);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          currentBalance: update.currentBalance,
          totalDeposit: update.totalDeposit,
          totalWithdraw: update.totalWithdraw,
        },
      };
      const result = await accountsCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Simple Bank Server is Running');
});

app.listen(port, () => {
  console.log(`Simple Bank app listening on port ${port}`);
});

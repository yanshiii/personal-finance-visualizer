import { getDb } from '../../mongodb';
import { ObjectId } from 'mongodb';
import { Transaction } from '../../models/Transaction';

async function getTransactions(req, res) {
  const db = await getDb();
  const transactionsCollection = db.collection('transactions');
  const transactions = await transactionsCollection.find().toArray();
  res.json(transactions);
}

async function addTransaction(req, res) {
  const db = await getDb();
  const transactionsCollection = db.collection('transactions');
  const transaction = new Transaction(req.body.amount, req.body.date, req.body.description);
  await transactionsCollection.insertOne(transaction);
  res.status(201).json(transaction);
}

async function editTransaction(req, res) {
  const db = await getDb();
  const transactionsCollection = db.collection('transactions');
  const filter = { _id: new ObjectId(req.query.id) };
  const update = { $set: req.body };
  await transactionsCollection.updateOne(filter, update);
  res.json({ message: 'Transaction updated successfully' });
}

async function deleteTransaction(req, res) {
  const db = await getDb();
  const transactionsCollection = db.collection('transactions');
  const filter = { _id: new ObjectId(req.query.id) };
  await transactionsCollection.deleteOne(filter);
  res.json({ message: 'Transaction deleted successfully' });
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getTransactions(req, res);
    case 'POST':
      return addTransaction(req, res);
    case 'PUT':
      return editTransaction(req, res);
    case 'DELETE':
      return deleteTransaction(req, res);
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

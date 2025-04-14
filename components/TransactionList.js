// components/TransactionList.js
import { useState, useEffect } from 'react';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data));
  }, []);

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction._id}>
            <span>Amount: {transaction.amount}</span>
            <span>Date: {transaction.date}</span>
            <span>Description: {transaction.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionList;

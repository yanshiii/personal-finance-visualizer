// components/TransactionForm.js
import { useState } from 'react';

function TransactionForm() {
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !date || !description) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, date, description }),
      });

      if (response.ok) {
        setError(null);
        setAmount(0);
        setDate('');
        setDescription('');
      } else {
        setError('Failed to add transaction');
      }
    } catch (err) {
      setError('Error adding transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default TransactionForm;

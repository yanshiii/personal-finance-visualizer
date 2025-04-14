// pages/index.js
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpensesChart from '../components/ExpensesChart';

export default function Home() {
  return (
    <div>
      <TransactionForm />
      <TransactionList />
      <ExpensesChart />
    </div>
  );
}

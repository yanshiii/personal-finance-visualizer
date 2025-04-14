// components/ExpensesChart.js
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function ExpensesChart() {
  const data = [
    { name: 'January', amount: 100 },
    { name: 'February', amount: 200 },
    { name: 'March', amount: 300 },
    // Add more months as needed
  ];

  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="amount" fill="#8884d8" />
    </BarChart>
  );
}

export default ExpensesChart;

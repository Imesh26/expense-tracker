import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState(0);

  // Fetch Data (Backend)
  const getTransactions = async () => {
    try {
      const res = await axios.get('https://expense-tracker-jet-alpha.vercel.app/api/v1/transactions');
      setTransactions(res.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  // Add Transaction
  const onSubmit = async (e) => {
    e.preventDefault();
    const newTransaction = { text, amount: +amount, category: 'General' };
    
    try {
      await axios.post('https://expense-tracker-jet-alpha.vercel.app/api/v1/transactions', newTransaction);
      getTransactions(); 
      setText('');
      setAmount(0);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`https://expense-tracker-jet-alpha.vercel.app/api/v1/transactions/${id}`);
      getTransactions();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // Calculations for Logic & Graph
  const total = transactions.reduce((acc, item) => (acc += item.amount), 0).toFixed(2);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0).toFixed(2);
  const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)).toFixed(2);

  // Chart Data
  const chartData = [
    { name: 'Income', value: parseFloat(income) },
    { name: 'Expense', value: parseFloat(expense) }
  ];
  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="container">
      <h1><Wallet size={32} /> Expense Tracker</h1>
      
      <div className="balance-card">
        <h4>YOUR BALANCE</h4>
        <h1 id="balance">Rs. {total}</h1>
        <div className="summary">
            <div className="inc"><TrendingUp size={16}/> Rs.{income}</div>
            <div className="exp"><TrendingDown size={16}/> Rs.{expense}</div>
        </div>
      </div>

      {/* --- CHART SECTION --- */}
      <div className="chart-section" style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie 
              data={chartData} 
              innerRadius={60} 
              outerRadius={80} 
              paddingAngle={5} 
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `Rs. ${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="form-container">
        <h3>Add New Transaction</h3>
        <form onSubmit={onSubmit}>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." required />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (e.g. -50 for lunch)" required />
          <button className="btn"><PlusCircle size={18} /> Add Transaction</button>
        </form>
      </div>

      <div className="history">
        <h3>History</h3>
        <ul className="list">
          {transactions.map(t => (
            <li key={t._id} className={t.amount < 0 ? 'minus' : 'plus'}>
              {t.text} 
              <div className="list-right">
                <span>{t.amount < 0 ? '-' : '+'}Rs.{Math.abs(t.amount).toFixed(2)}</span>
                <button onClick={() => deleteTransaction(t._id)} className="delete-btn">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
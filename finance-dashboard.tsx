import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const initialExpenses = [
  { name: 'Housing', value: 1000 },
  { name: 'Food', value: 400 },
  { name: 'Transportation', value: 200 },
  { name: 'Entertainment', value: 150 },
  { name: 'Utilities', value: 250 },
];

const initialIncome = [
  { name: 'Salary', value: 2500 },
  { name: 'Freelance', value: 500 },
];

const monthlyData = [
  { name: 'Jan', income: 2500, expenses: 2000 },
  { name: 'Feb', income: 2700, expenses: 2200 },
  { name: 'Mar', income: 2600, expenses: 2100 },
  { name: 'Apr', income: 2800, expenses: 2300 },
];

const FinanceDashboard = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [incomes, setIncomes] = useState(initialIncome);
  const [newTransaction, setNewTransaction] = useState({ name: '', value: '', type: 'expense' });
  const [savingsGoal, setSavingsGoal] = useState(5000);
  const [currentSavings, setCurrentSavings] = useState(1000);

  const addTransaction = () => {
    if (newTransaction.name && newTransaction.value) {
      if (newTransaction.type === 'expense') {
        setExpenses([...expenses, { ...newTransaction, value: Number(newTransaction.value) }]);
      } else {
        setIncomes([...incomes, { ...newTransaction, value: Number(newTransaction.value) }]);
      }
      setNewTransaction({ name: '', value: '', type: 'expense' });
    }
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0);
  const totalIncome = incomes.reduce((sum, item) => sum + item.value, 0);
  const balance = totalIncome - totalExpenses;

  useEffect(() => {
    setCurrentSavings(prev => prev + balance);
  }, [balance]);

  const savingsProgress = (currentSavings / savingsGoal) * 100;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Personal Finance Dashboard</h1>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#8884d8" />
                    <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total Income: ${totalIncome}</p>
                <p>Total Expenses: ${totalExpenses}</p>
                <p>Balance: ${balance}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <CardTitle>Savings Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={savingsProgress} className="w-full" />
              <p className="mt-2">Current Savings: ${currentSavings}</p>
              <p>Goal: ${savingsGoal}</p>
              <Input
                type="number"
                placeholder="Update savings goal"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Transaction name"
              value={newTransaction.name}
              onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newTransaction.value}
              onChange={(e) => setNewTransaction({ ...newTransaction, value: e.target.value })}
            />
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              className="border rounded px-2"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <Button onClick={addTransaction}>Add</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;

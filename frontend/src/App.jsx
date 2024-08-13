import { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';

const App = () => {
    const [month, setMonth] = useState('March');
    const [transactions, setTransactions] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [barChartData, setBarChartData] = useState({});
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTransactions();
        fetchStatistics();
        fetchBarChartData();
    }, [month, search]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:3000/list-transactions', {
                params: { month, search }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('http://localhost:3000/statistics', { params: { month } });
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const fetchBarChartData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/bar-chart', { params: { month } });
            setBarChartData(response.data);
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Transaction Dashboard</h1>
            
            <div className="mb-6 w-1/6">
                <label className="block text-lg font-medium mb-2">Select Month:</label>
                <select 
                    value={month} 
                    onChange={handleMonthChange} 
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
            </div>

            <div className="mb-6 w-1/6">
                <input 
                    type="text" 
                    placeholder="Search transactions" 
                    value={search}
                    onChange={handleSearchChange}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
            </div>

            <TransactionTable transactions={transactions} />
            <div className="mt-6 space-y-6">
                <Statistics statistics={statistics} />
                <BarChart data={barChartData} />
            </div>
        </div>
    );
};

export default App;

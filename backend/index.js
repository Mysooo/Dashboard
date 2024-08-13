const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors())
const mongoUri = 'mongodb://127.0.0.1:27017/mongosh';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const transactionSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true },
    image: { type: String, required: true },
    sold: { type: Boolean, required: true },
    dateOfSale: { type: Date, required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/initialize-database', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        await Transaction.insertMany(data, { ordered: false });

        res.send({ message: 'Database initialized with seed data' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to initialize database' });
    }
});

// Helper function to get month
const getMonthIndex = (month) => {
    const monthIndex = new Date(`${month} 1, 2021`).getMonth() + 1;
    if (monthIndex < 1 || monthIndex > 12) {
        throw new Error('Invalid month');
    }
    return monthIndex;
};

app.get('/list-transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;

    try {
        const monthIndex = month ? getMonthIndex(month) : null;

        const query = {
            $and: [
                {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { price: parseFloat(search) || 0 }
                    ]
                },
                monthIndex ? {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, monthIndex]
                    }
                } : {}
            ]
        };

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage))
            .exec();

        res.send(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to list transactions' });
    }
});

app.get('/statistics', async (req, res) => {
    const { month } = req.query;

    try {
        const monthIndex = getMonthIndex(month);

        const transactions = await Transaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthIndex]
            }
        });

        const totalSaleAmount = transactions.reduce((sum, transaction) => sum + (transaction.sold ? transaction.price : 0), 0);
        const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
        const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

        res.send({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch statistics' });
    }
});

app.get('/bar-chart', async (req, res) => {
    const { month } = req.query;

    const priceRanges = {
        '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0, '401-500': 0,
        '501-600': 0, '601-700': 0, '701-800': 0, '801-900': 0, '901-above': 0
    };

    try {
        const monthIndex = getMonthIndex(month);

        const transactions = await Transaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthIndex]
            }
        });

        transactions.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) priceRanges['0-100']++;
            else if (price <= 200) priceRanges['101-200']++;
            else if (price <= 300) priceRanges['201-300']++;
            else if (price <= 400) priceRanges['301-400']++;
            else if (price <= 500) priceRanges['401-500']++;
            else if (price <= 600) priceRanges['501-600']++;
            else if (price <= 700) priceRanges['601-700']++;
            else if (price <= 800) priceRanges['701-800']++;
            else if (price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        res.send(priceRanges);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch bar chart data' });
    }
});

app.get('/pie-chart', async (req, res) => {
    const { month } = req.query;

    try {
        const monthIndex = getMonthIndex(month);

        const transactions = await Transaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthIndex]
            }
        });

        const categoryCounts = transactions.reduce((counts, transaction) => {
            counts[transaction.category] = (counts[transaction.category] || 0) + 1;
            return counts;
        }, {});

        res.send(categoryCounts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch pie chart data' });
    }
});

app.get('/combined-data', async (req, res) => {
    const { month } = req.query;

    try {
        const [statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:${port}/statistics`, { params: { month } }),
            axios.get(`http://localhost:${port}/bar-chart`, { params: { month } }),
            axios.get(`http://localhost:${port}/pie-chart`, { params: { month } })
        ]);

        res.send({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch combined data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
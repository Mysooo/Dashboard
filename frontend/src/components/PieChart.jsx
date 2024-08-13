import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = ({ month }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPieChartData = async () => {
            try {
                const response = await axios.get(`/pie-chart?month=${month}`);
                const categories = response.data;

                const colorPalette = [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ];

                const labels = Object.keys(categories);
                const colors = labels.map((_, index) => colorPalette[index % colorPalette.length]);

                const chartData = {
                    labels,
                    datasets: [{
                        data: Object.values(categories),
                        backgroundColor: colors,
                    }]
                };
                setData(chartData);
            } catch (error) {
                setError('Failed to fetch pie chart data');
            } finally {
                setLoading(false);
            }
        };

        fetchPieChartData();
    }, [month]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Category Distribution</h2>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;

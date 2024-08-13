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
                    '#007BFF', // Blue
                    '#6610F2', // Purple
                    '#E83E8C', // Pink
                    '#FD7E14', // Orange
                    '#28A745', // Green
                    '#6F42C1'  // Dark Purple
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

    if (loading) return <p className="text-white">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4 bg-black border border-blue-500 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Category Distribution</h2>
            <div className="h-72">
                <Pie data={data} options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: 'white', // Legend text color
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || '';
                                    return `${label}: ${value}`;
                                }
                            }
                        }
                    }
                }} />
            </div>
        </div>
    );
};

export default PieChart;

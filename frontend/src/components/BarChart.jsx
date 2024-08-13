import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: 'Number of Items',
                data: Object.values(data),
                backgroundColor: 'rgba(0, 123, 255, 0.6)', // Blue background
                borderColor: 'rgba(0, 123, 255, 1)', // Blue border
                borderWidth: 1,
            }
        ],
    };

    return (
        <div className="container mx-auto p-4 bg-black border border-blue-500 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Bar Chart</h2>
            <div className="h-72">
                <Bar data={chartData} options={{
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
                                    const label = context.dataset.label || '';
                                    const value = context.raw || '';
                                    return `${label}: ${value}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                color: 'white', // X-axis text color
                            }
                        },
                        y: {
                            grid: {
                                borderDash: [5, 5],
                                color: '#333', // Darker color for grid lines
                            },
                            ticks: {
                                color: 'white', // Y-axis text color
                            }
                        }
                    }
                }} />
            </div>
        </div>
    );
};

export default BarChart;

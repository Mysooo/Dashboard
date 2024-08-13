import React from 'react';

const Statistics = ({ statistics }) => {
    const totalSaleAmount = statistics.totalSaleAmount || 0;
    const totalSoldItems = statistics.totalSoldItems || 0;
    const totalNotSoldItems = statistics.totalNotSoldItems || 0;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-white">Statistics</h2>
            <div className="bg-black p-4 border border-blue-500 rounded-lg shadow-lg">
                <p className="text-lg mb-2 text-white">
                    <span className="font-semibold">Total Sale Amount:</span> ${totalSaleAmount.toFixed(2)}
                </p>
                <p className="text-lg mb-2 text-white">
                    <span className="font-semibold">Total Sold Items:</span> {totalSoldItems}
                </p>
                <p className="text-lg text-white">
                    <span className="font-semibold">Total Not Sold Items:</span> {totalNotSoldItems}
                </p>
            </div>
        </div>
    );
};

export default Statistics;

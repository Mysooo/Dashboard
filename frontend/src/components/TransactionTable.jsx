import { useState } from 'react';

const TransactionTable = ({ transactions }) => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    
    const handleNext = () => setPage(page + 1);
    const handlePrevious = () => setPage(page - 1);

    const paginatedTransactions = transactions.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-white">Transactions</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-black border border-blue-600 rounded-lg shadow-md">
                    <thead className="bg-blue-800 text-white">
                        <tr>
                            <th className="px-4 py-2 border-b border-blue-600 text-left">ID</th>
                            <th className="px-4 py-2 border-b border-blue-600 text-left">Title</th>
                            <th className="px-4 py-2 border-b border-blue-600 text-left">Price</th>
                            <th className="px-4 py-2 border-b border-blue-600 text-left">Description</th>
                            <th className="px-4 py-2 border-b border-blue-600 text-left">Category</th>
                            <th className="px-4 py-2 border-b border-blue-600 text-left">Image</th>
                            <th className="px-4 py-2 border-b border-blue-600 text-left">Sold</th>
                            <th className="px-4 py-2 border-b border-blue-600 text-left">Date of Sale</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {paginatedTransactions.map(transaction => (
                            <tr 
                                key={transaction.id} 
                                className="hover:bg-blue-900 transition-transform duration-300 transform hover:scale-105"
                            >
                                <td className="px-4 py-2 border-b border-blue-600">{transaction.id}</td>
                                <td className="px-4 py-2 border-b border-blue-600">{transaction.title}</td>
                                <td className="px-4 py-2 border-b border-blue-600">${transaction.price.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b border-blue-600 text-sm break-words">{transaction.description}</td>
                                <td className="px-4 py-2 border-b border-blue-600">{transaction.category}</td>
                                <td className="px-4 py-2 border-b border-blue-600">
                                    <img src={transaction.image} alt={transaction.title} className="w-24 h-24 object-cover rounded" />
                                </td>
                                <td className="px-4 py-2 border-b border-blue-600">{transaction.sold ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2 border-b border-blue-600">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button 
                    onClick={handlePrevious} 
                    disabled={page === 1} 
                    className={`px-4 py-2 font-semibold text-white bg-blue-600 rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                    Previous
                </button>
                <button 
                    onClick={handleNext} 
                    className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionTable;

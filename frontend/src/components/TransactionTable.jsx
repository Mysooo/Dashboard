import { useState } from 'react';

const TransactionTable = ({ transactions }) => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    
    const handleNext = () => setPage(page + 1);
    const handlePrevious = () => setPage(page - 1);

    const paginatedTransactions = transactions.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Transactions</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 border-b text-left">ID</th>
                            <th className="px-4 py-2 border-b text-left">Title</th>
                            <th className="px-4 py-2 border-b text-left">Price</th>
                            <th className="px-4 py-2 border-b text-left">Description</th>
                            <th className="px-4 py-2 border-b text-left">Category</th>
                            <th className="px-4 py-2 border-b text-left">Image</th>
                            <th className="px-4 py-2 border-b text-left">Sold</th>
                            <th className="px-4 py-2 border-b text-left">Date of Sale</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {paginatedTransactions.map(transaction => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">{transaction.id}</td>
                                <td className="px-4 py-2 border-b">{transaction.title}</td>
                                <td className="px-4 py-2 border-b">${transaction.price.toFixed(2)}</td>
                                <td className="px-4 py-2 border-b text-sm break-words">{transaction.description}</td>
                                <td className="px-4 py-2 border-b">{transaction.category}</td>
                                <td className="px-4 py-2 border-b">
                                    <img src={transaction.image} alt={transaction.title} className="w-24 h-24 object-cover rounded" />
                                </td>
                                <td className="px-4 py-2 border-b">{transaction.sold ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2 border-b">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button 
                    onClick={handlePrevious} 
                    disabled={page === 1} 
                    className={`px-4 py-2 font-semibold text-white bg-blue-500 rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                    Previous
                </button>
                <button 
                    onClick={handleNext} 
                    className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionTable;

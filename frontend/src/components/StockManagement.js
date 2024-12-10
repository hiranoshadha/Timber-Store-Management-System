import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockManagement = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stockQuantity, setStockQuantity] = useState({sQty : 0});
    const [transactionType, setTransactionType] = useState('add');
    const [stockTransactions, setStockTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Add new state for editing
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Fetch products and transactions
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const handleProductSelect = async (productId) => {
        setSelectedProduct(productId);
        try {
            const response = await axios.get(`http://localhost:8081/api/stock-transactions/${productId}`);
            setStockTransactions(response.data);
        } catch (error) {
            console.error('Error fetching stock transactions', error);
        }
    };

    const handleStockTransaction = async (e) => {
        e.preventDefault();
        if (!selectedProduct || stockQuantity <= 0) {
            showNotification('Please select a product and enter a valid quantity', 'error');
            return;
        }

        try {
            const endpoint = `http://localhost:8081/api/products/${selectedProduct}/${transactionType === 'add' ? 'add-stock' : 'remove-stock'}`;
            await axios.post(endpoint, null, { params: { quantity: stockQuantity.sQty } });
            await fetchProducts();
            await handleProductSelect(selectedProduct);
            setStockQuantity({sQty : 0});
            showNotification(`✨ Stock ${transactionType === 'add' ? 'added' : 'removed'} successfully!`);
        } catch (error) {
            showNotification(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    // Add these new handler functions
    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setStockQuantity({sQty : transaction.quantity});
        setTransactionType(transaction.transactionType.toLowerCase());
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8081/api/stock-transactions/${editingTransaction.id}`, {
                quantity: stockQuantity.sQty,
                transactionType: transactionType.toUpperCase(),
                product: editingTransaction.product
            });
            setEditingTransaction(null);
            setStockQuantity({sQty : 0});
            await fetchProducts();
            await handleProductSelect(selectedProduct);
            showNotification('🎉 Transaction updated successfully!');
        } catch (error) {
            showNotification(error.response?.data?.message || 'Update failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(`http://localhost:8081/api/stock-transactions/${id}`);
                await fetchProducts();
                await handleProductSelect(selectedProduct);
                showNotification('🗑️ Transaction deleted successfully!');
            } catch (error) {
                showNotification(error.response?.data?.message || 'Deletion failed', 'error');
            }
        }
    };

    // Update the form submission handler
    const handleSubmit = editingTransaction ? handleUpdate : handleStockTransaction;

    const Notification = ({ message, type }) => (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-500 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
            <div className="flex items-center">
                {type === 'success' ? (
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                {message}
            </div>
        </div>
    );
    
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };
    
    const filteredTransactions = stockTransactions.filter(transaction => 
        transaction.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(transaction.transactionTime).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {notification.show && (
                <Notification message={notification.message} type={notification.type} />
            )}
            <h2 className="text-2xl font-bold mb-4 text-green-600">Stock Management</h2>
            
            {/* Product Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product
                </label>
                <select
                    value={selectedProduct || ''}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                    <option value="">Select a Product</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.productName} (Current Stock: {product.currentStock})
                        </option>
                    ))}
                </select>
            </div>

            {/* Stock Transaction Form */}
            {selectedProduct && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Transaction Type
                            </label>
                            <select
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            >
                                <option value="add">Add Stock</option>
                                <option value="remove">Remove Stock</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <input
                                type="number"
                                value={stockQuantity.sQty}
                                onChange={(e) => setStockQuantity({ ...stockQuantity, sQty: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                required
                                min="0"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                        {editingTransaction ? 'Update Transaction' : 'Process Stock Transaction'}
                    </button>
                </form>
            )}

            {/* Stock Transactions History */}
            {stockTransactions.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-green-600">
                        Stock Transaction History
                    </h3>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by Date, Product Name, or Type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-green-100">
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Product Name</th>
                                <th className="border p-2">Type</th>
                                <th className="border p-2">Quantity</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-green-50">
                                        <td className="border p-2">
                                            {new Date(transaction.transactionTime).toLocaleString()}
                                        </td>
                                        <td className="border p-2">
                                            {transaction.product.productName}
                                        </td>
                                        <td className="border p-2">
                                            {transaction.transactionType}
                                        </td>
                                        <td className="border p-2">
                                            {transaction.quantity}
                                        </td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => handleEdit(transaction)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        No transactions found matching your search
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StockManagement;
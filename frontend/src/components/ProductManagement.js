import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [newProduct, setNewProduct] = useState({
        productCode: '',
        productName: '',
        price: 0,
        currentStock: 0
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setNewProduct({
            productCode: product.productCode,
            productName: product.productName,
            price: product.price,
            currentStock: product.currentStock
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8081/api/products/${editingProduct.id}`, newProduct);
            setEditingProduct(null);
            setNewProduct({
                productCode: '',
                productName: '',
                price: 0,
                currentStock: 0
            });
            fetchProducts();
            showNotification('🎉 Product updated successfully! Your changes have been saved.');
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to update product', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:8081/api/products/${id}`);
                fetchProducts();
                showNotification('🗑️ Product deleted successfully! The item has been removed.');
            } catch (error) {
                showNotification(error.response?.data?.message || 'Failed to delete product', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/products', newProduct);
            fetchProducts();
            setNewProduct({
                productCode: '',
                productName: '',
                price: 0,
                currentStock: 0
            });
            showNotification('✨ Product created successfully! Your new product is now in the system.');
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to create product', 'error');
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };
    

    // Add this component inside ProductManagement before the return statement
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


    // Add this state near other useState declarations
    const [searchTerm, setSearchTerm] = useState('');

    // Add this function to filter products
    const filteredProducts = products.filter(product => 
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {notification.show && (
                <Notification message={notification.message} type={notification.type} />
            )}
            <h2 className="text-2xl font-bold mb-4 text-green-600">Product Management</h2>
            
            <form onSubmit={editingProduct ? handleUpdate : handleSubmit} className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Code
                        </label>
                        <input
                            type="text"
                            name="productCode"
                            value={newProduct.productCode}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="productName"
                            value={newProduct.productName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Initial Stock
                        </label>
                        <input
                            type="number"
                            name="currentStock"
                            value={newProduct.currentStock}
                            onChange={handleInputChange}
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
                    {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
            </form>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-green-600">Product List</h3>
                {/* Add this search bar above the product table */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by Product Code or Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-green-100">
                            <th className="border p-2">Product Code</th>
                            <th className="border p-2">Product Name</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Current Stock</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-green-50">
                                    <td className="border p-2">{product.productCode}</td>
                                    <td className="border p-2">{product.productName}</td>
                                    <td className="border p-2">Rs.{product.price.toFixed(2)}</td>
                                    <td className="border p-2">{product.currentStock}</td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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
                                    No products found matching your search
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>    );
};

export default ProductManagement;
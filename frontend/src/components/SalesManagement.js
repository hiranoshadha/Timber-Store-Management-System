import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesManagement = () => {
    const [sales, setSales] = useState([]);
    const [editingSale, setEditingSale] = useState(null);
    const [newSale, setNewSale] = useState({
        description: '',
        amount: 0
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

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

    const filteredSales = sales.filter(sale => 
        sale.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(sale.saleTime).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch sales
    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/sales');
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSale(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (sale) => {
        setEditingSale(sale);
        setNewSale({
            description: sale.description,
            amount: sale.amount
        });
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8081/api/sales/${editingSale.id}`, {
                ...newSale,
                saleTime: editingSale.saleTime
            });
            setEditingSale(null);
            setNewSale({ description: '', amount: 0 });
            fetchSales();
            showNotification('🎉 Sale updated successfully!');
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to update sale', 'error');
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            try {
                await axios.delete(`http://localhost:8081/api/sales/${id}`);
                fetchSales();
                showNotification('🗑️ Sale deleted successfully!');
            } catch (error) {
                showNotification(error.response?.data?.message || 'Failed to delete sale', 'error');
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/sales', {
                ...newSale,
                saleTime: new Date().toISOString()
            });
            fetchSales();
            // Reset form
            setNewSale({
                description: '',
                amount: 0
            });
            showNotification('✨ Sale recorded successfully!');
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to record sale', 'error');
        }
    };
    
      return (
          <div className="bg-white p-6 rounded-lg shadow-md">
              {notification.show && (
                  <Notification message={notification.message} type={notification.type} />
              )}
              <h2 className="text-2xl font-bold mb-4 text-green-600">Sales Management</h2>
            
              {/* Sale Creation Form */}
              <form onSubmit={editingSale ? handleUpdate : handleSubmit} className="mb-6">

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700">
                              Description
                          </label>
                          <input
                              type="text"
                              name="description"
                              value={newSale.description}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">
                              Amount
                          </label>
                          <input
                              type="number"
                              name="amount"
                              value={newSale.amount}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                              step="0.01"
                              required
                              min="0"
                          />
                      </div>
                  </div>
                  <button 
      type="submit" 
      className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
  >
      {editingSale ? 'Update Sale' : 'Create Sale'}
  </button>

              </form>

              {/* Sales List */}
              <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-600">Sales History</h3>
                  <div className="mb-4">
                      <input
                          type="text"
                          placeholder="Search by Date or Description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                      />
                  </div>
                  <table className="w-full border-collapse">
                  <thead>
      <tr className="bg-green-100">
          <th className="border p-2">Date</th>
          <th className="border p-2">Description</th>
          <th className="border p-2">Amount</th>
          <th className="border p-2">Actions</th>
      </tr>
  </thead>
  <tbody>
      {filteredSales.length > 0 ? (
          filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-green-50">
                  <td className="border p-2">
                      {new Date(sale.saleTime).toLocaleString()}
                  </td>
                  <td className="border p-2">{sale.description}</td>
                  <td className="border p-2">Rs.{sale.amount.toFixed(2)}</td>
                  <td className="border p-2">
                      <button
                          onClick={() => handleEdit(sale)}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                      >
                          Edit
                      </button>
                      <button
                          onClick={() => handleDelete(sale.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                          Delete
                      </button>
                  </td>
              </tr>
          ))
      ) : (
          <tr>
              <td colSpan="4" className="text-center py-4">
                  No sales found matching your search
              </td>
          </tr>
      )}
  </tbody>

                  </table>
              </div>
          </div>
      );
  };

export default SalesManagement;
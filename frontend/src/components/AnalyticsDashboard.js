import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [financialReport, setFinancialReport] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dashboardResponse, financialResponse] = await Promise.all([
        axios.get('http://localhost:8081/api/analytics/dashboard'),
        axios.get('http://localhost:8081/api/analytics/financial-report')
      ]);
      
      setDashboardData(dashboardResponse.data);
      setFinancialReport(financialResponse.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Failed to load analytics data');
    }
  };

  const prepareFinancialChartData = () => {
    if (!financialReport) return [];

    const months = new Set([
      ...Object.keys(financialReport.monthlySales),
      ...Object.keys(financialReport.monthlyPurchases)
    ]);
    console.log('Months:', months);
    return Array.from(months).map(month => ({
      month,
      sales: financialReport.monthlySales[month] || 0,
      purchases: financialReport.monthlyPurchases[month] || 0,
      profit: (financialReport.monthlySales[month] || 0) - (financialReport.monthlyPurchases[month] || 0)
    }));
  };

  if (!dashboardData || !financialReport) {
    return <div className="text-center p-4">Loading analytics...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl text-green-700">{dashboardData.totalProducts}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-2xl text-green-700">
            Rs.{dashboardData.salesAnalytics.totalSalesAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Purchases</h3>
          <p className="text-2xl text-green-700">
           Rs.{dashboardData.purchaseAnalytics.totalPurchaseAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Stock Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-green-600">Stock Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded">
            <p>Total Added Stock</p>
            <p className="font-bold">{dashboardData.stockSummary.totalAddedStock}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p>Total Removed Stock</p>
            <p className="font-bold">{dashboardData.stockSummary.totalRemovedStock}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p>Net Stock Change</p>
            <p className="font-bold">{dashboardData.stockSummary.netStockChange}</p>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-green-600">Top Products by Movement</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100">
              <th className="border p-2">Product Code</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Total Movement</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.topProductsByMovement.map((product, index) => (
              <tr key={index} className="hover:bg-green-50">
                <td className="border p-2">{product.productCode}</td>
                <td className="border p-2">{product.productName}</td>
                <td className="border p-2">{product.totalMovement.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2 text-green-600">Monthly Financial Overview</h3>
        <LineChart width={800} height={400} data={prepareFinancialChartData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#16a34a" name="Sales" />
          <Line type="monotone" dataKey="purchases" stroke="#dc2626" name="Purchases" />
          <Line type="monotone" dataKey="profit" stroke="#2563eb" name="Profit" />
        </LineChart>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

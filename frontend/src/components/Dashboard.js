import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  Truck, 
  ShoppingCart, 
  BarChart2,
  TrendingUp 
} from 'lucide-react';
import ProductManagement from './ProductManagement';
import StockManagement from './StockManagement';
import PurchaseManagement from './PurchaseManagement';
import SalesManagement from './SalesManagement';
import AnalyticsDashboard from './AnalyticsDashboard';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('products');

  const menuItems = [
    
    { 
      icon: <Package className="w-6 h-6" />, 
      name: 'Product Management', 
      section: 'products' 
    },
    { 
      icon: <Truck className="w-6 h-6" />, 
      name: 'Stock Management', 
      section: 'stock' 
    },
    { 
      icon: <ShoppingCart className="w-6 h-6" />, 
      name: 'Purchases', 
      section: 'purchases' 
    },
    { 
      icon: <BarChart2 className="w-6 h-6" />, 
      name: 'Sales', 
      section: 'sales' 
    },
    { 
      icon: <TrendingUp className="w-6 h-6" />, 
      name: 'Analytics', 
      section: 'analytics' 
    }
    
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-600 text-white p-4">
        <div className="text-2xl font-bold mb-10 text-center">
          Timber Store
        </div>
        <nav>
          {menuItems.map((item) => (
            <div 
              key={item.section}
              className={`
                flex items-center p-3 mb-2 rounded cursor-pointer
                ${activeSection === item.section 
                  ? 'bg-green-700' 
                  : 'hover:bg-green-500'}
              `}
              onClick={() => setActiveSection(item.section)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 bg-gray-100 overflow-y-auto">
        {activeSection === 'products' && <ProductManagement />}
        {activeSection === 'stock' && <StockManagement />}
        {activeSection === 'purchases' && <PurchaseManagement />}
        {activeSection === 'sales' && <SalesManagement />}
        {activeSection === 'analytics' &&<AnalyticsDashboard />}
      </div>
    </div>
  );
};




export default Dashboard;
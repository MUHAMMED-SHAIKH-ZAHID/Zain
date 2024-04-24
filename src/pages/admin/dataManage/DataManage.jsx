import { useState } from 'react';
import Categories from './categories/Categories';
import Brands from './brands/Brands';
import RoutesComponent from './routes/RoutesComponent';

const DataManage = () => {
  const [activeTab, setActiveTab] = useState('category');

  const renderTable = () => {
    switch (activeTab) {
      case 'category':
        return <Categories />
      case 'brand':
        return <Brands />
      case 'product':
        return <div>Table for Products</div>;
      case 'routes':
        return <RoutesComponent />
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-5 rounded-lg shadow">
        <ul className="flex border-b">
          {['category', 'brand', 'product', 'routes'].map((tab) => (
            <li key={tab} className="-mb-px mr-1">
              <button
                onClick={() => setActiveTab(tab)}
                className={`inline-block py-2 px-4 text-sm font-medium leading-none rounded-t-lg
                  ${activeTab === tab ? 'text-blue-700 border-blue-500 border-l border-t border-r' : 'text-blue-500 hover:text-blue-800'}
                  focus:outline-none`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default DataManage;

import { useEffect, useState } from 'react';
import Categories from './categories/Categories';
import Brands from './brands/Brands';
import RoutesComponent from './routes/RoutesComponent';
import ProductComponent from './products/ProductComponent';
import { useDispatch } from 'react-redux';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import Locations from './locations/Locations';
import TaxComponent from './tax/TaxComponent';
import ExpenseTypes from './expencetype/ExpenceType';

const DataManage = () => {
  const [activeTab, setActiveTab] = useState('brand');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Data Manage"));
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const renderTable = () => {
    switch (activeTab) {
      case 'brand':
        return <Categories />;
      case 'category':
        return <Brands />;
      case 'tax':
        return <TaxComponent />;
      // case 'routes':
      //   return <RoutesComponent />;
      // case 'location' :
      //   return <Locations />;
      case 'expense types' :
        return <ExpenseTypes />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="container mx-auto  p-4 ">
      <div className="bg-white p-5 rounded-lg shadow">
        <ul className="flex border-b">
          {['brand','category','tax' ,'expense types'].map((tab) => (
            <li key={tab} className="-mb-px mr-1">
              <button
                onClick={() => setActiveTab(tab)}
                className={`inline-block py-2 px-4 text-sm font-medium leading-none rounded-t-lg
                  ${activeTab === tab ? 'text-white border-blue-500 bg-blue-600 border-l border-t border-r' : 'text-blue-500 hover:text-blue-800'}
                  focus:outline-none`}
              >
                {tab.charAt(0).toUpperCase() + tab?.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 p-4 border rounded-lg bg-gray-50" style={{ height: 'auto', overflowY: 'auto' }}>
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default DataManage;

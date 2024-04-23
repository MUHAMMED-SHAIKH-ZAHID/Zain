import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { deleteRoute, fetchRoutes } from '../../../../redux/features/DataManageSlices/RoutesSlice';
import Modal from '../../../../components/commoncomponents/Modal';
import { RouteForm } from './RouteForm';

const Routes = () => {
  const dispatch = useDispatch();
  const { routes } = useSelector((state) => state?.routes?.routes);
  const [showModal, setShowModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);

  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentRoute(null);
    setShowModal(true);
  };

  const handleEdit = (route) => {
    setCurrentRoute(route);
    setShowModal(true);
  };

  const handleDelete = (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      dispatch(deleteRoute(routeId));
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold leading-tight">Routes</h2>
          <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Route
          </button>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {routes?.map((route) => (
                  <tr key={route.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">{route.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{route.description}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <button onClick={() => handleEdit(route)} className="text-indigo-600 hover:text-indigo-900 px-4">
                        <BiEdit />
                      </button>
                      <button onClick={() => handleDelete(route.id)} className="text-red-600 hover:text-red-900">
                        <BiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          visible={showModal}
          onClose={closeModal}
          title={currentRoute ? 'Edit Route' : 'Add Route'}
          content={<RouteForm initialData={currentRoute} onSubmit={closeModal} onCancel={closeModal} />}
        />
      )}
    </div>
  );
};

export default Routes;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiEdit, BiTrash, BiSearch } from 'react-icons/bi';
import Modal from '../../../../components/commoncomponents/Modal';
import { LocationForm } from './LocationForm';
import { createLocation, deleteLocation, fetchLocations, updateLocation } from '../../../../redux/features/DataManageSlices/LocationSlice';
import { toast } from 'react-toastify';

const Locations = () => {
    const dispatch = useDispatch();
    const { locations, loading } = useSelector(state => state?.locations);
    const [currentPage, setCurrentPage] = useState(1);
    const [locationsPerPage] = useState(10);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationToDelete, setLocationToDelete] = useState(null);
    const [search, setSearch] = useState('');


    useEffect(() => {
      dispatch(fetchLocations());
    }, [dispatch]);

    const filteredLocations = (locations || []).filter(loc =>
        loc.location.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastLocation = currentPage * locationsPerPage;
    const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
    const currentLocations = filteredLocations?.slice(indexOfFirstLocation, indexOfLastLocation);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredLocations.length / locationsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleCreate = () => {
        setCurrentLocation(null);
        setModalVisible(true);
    };

    const handleEdit = (location) => {
        setCurrentLocation(location);
        setModalVisible(true);
    };

    const openDeleteModal = (location) => {
        setLocationToDelete(location);
        setDeleteModalVisible(true);
    };

    const handleDelete = () => {
        dispatch(deleteLocation(locationToDelete.id));
        setDeleteModalVisible(false);
    };

    const handleSubmit = (data) => {
        if (currentLocation) {
            dispatch(updateLocation({ id: currentLocation.id, ...data })).then((res)=>{
              toast.success(res.payload.success)
            })
        } else {
            dispatch(createLocation(data)).then((res)=>{
              toast.success(res.payload.success)
            })
        }
        setModalVisible(false);
    };

    const handleClose = () => {
        setModalVisible(false);
        setDeleteModalVisible(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
      <div className="container mx-auto  sm:px-8 pt-6 pb-2">
      <div className="">
          <h2 className="text-xl mb-2 font-medium leading-tight">Location</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Search locations..."
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
              />
              <BiSearch className="text-gray-500 ml-2 my-auto"/>
            </div>
            <button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
              Add New Location
            </button>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {currentLocations?.map(loc => (
                  <tr key={loc.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {loc.location}
                    </td>
                    <td className="px-5 py-6 border-b border-gray-200 bg-white text-sm flex justify-end items-center">
                      <button onClick={() => handleEdit(loc)} className="text-indigo-600 hover:text-indigo-900 px-4">
                        <BiEdit />
                      </button>
                      {/* <button onClick={() => openDeleteModal(loc)} className="text-red-600 hover:text-red-900 px-4">
                        <BiTrash />
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              {pageNumbers.map(number => (
                <button key={number} onClick={() => paginate(number)} className="text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-1 px-2 mx-1 rounded">
                  {number}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Modal
          visible={modalVisible}
          onClose={handleClose}
          title={currentLocation ? 'Edit Location' : 'Add Location'}
          content={<LocationForm initialData={currentLocation} onSubmit={handleSubmit} onCancel={handleClose} />}
        />
        <Modal
          visible={deleteModalVisible}
          onClose={handleClose}
          title="Confirm Delete"
          content={<div>
            <p>Are you sure you want to delete this location?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={handleClose} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded">
                Delete
              </button>
            </div>
          </div>}
        />
      </div>
    );
};

export default Locations;


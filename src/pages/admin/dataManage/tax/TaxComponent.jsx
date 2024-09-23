import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiEdit, BiSearch, BiTrash } from 'react-icons/bi';
import { createTax, deleteTax, fetchTaxes, updateTax } from '../../../../redux/features/DataManageSlices/TaxSlice';
import Modal from '../../../../components/commoncomponents/Modal';
import { TaxForm } from './TaxForm';

const TaxComponent = () => {
  const dispatch = useDispatch();
  const { taxes, loading, error } = useSelector(state => state?.tax);
  const [currentPage, setCurrentPage] = useState(1);
  const [taxesPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentTax, setCurrentTax] = useState(null);
  const [taxToDelete, setTaxToDelete] = useState(null);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    dispatch(fetchTaxes());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredTaxes = (taxes || []).filter(tax =>
    tax?.hsn_code?.toLowerCase()?.includes(search.toLowerCase())
  );

  const indexOfLastTax = currentPage * taxesPerPage;
  const indexOfFirstTax = indexOfLastTax - taxesPerPage;
  const currentTaxes = filteredTaxes?.slice(indexOfFirstTax, indexOfLastTax);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredTaxes.length / taxesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleCreate = () => {
    setCurrentTax(null);
    setModalVisible(true);
  };

  const handleEdit = (tax) => {
    setCurrentTax(tax);
    setModalVisible(true);
  };

  const openDeleteModal = (tax) => {
    setTaxToDelete(tax);
    setDeleteModalVisible(true);
  };

  const handleDelete = () => {
    dispatch(deleteTax(taxToDelete.id));
    setDeleteModalVisible(false);
  };

  const handleSubmit = (data) => {
    if (currentTax) {
      dispatch(updateTax({ id: currentTax.id, ...data }));
    } else {
      dispatch(createTax(data));
    }
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
    setDeleteModalVisible(false);
  };

  return (
    <div className="container mx-auto sm:px-8 pt-6 pb-2">
      <div>
        <h2 className="text-xl mb-2 font-medium leading-tight">Tax</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search Tax..."
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
            />
            <BiSearch className="text-gray-500 ml-2 my-auto" />
          </div>
          <button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
            Add New Tax
          </button>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hsn Code
                </th>
                <th className="px-5 py-3 border-b-2 text-center border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tax Percentage
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
              </tr>
            </thead>
            <tbody>
              {currentTaxes?.map(tax => (
                <tr key={tax.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {tax.hsn_code}
                  </td>
                  <td className="px-5 text-center py-5 border-b border-gray-200 bg-white text-sm">
                    {tax?.tax_rates?.map(rate => rate.tax_rate).join(' , ')} 
                  </td>
                  <td className="px-5 py-6 border-b border-gray-200 bg-white text-sm flex justify-end items-center">
                    <button onClick={() => handleEdit(tax)} className="text-indigo-600 hover:text-indigo-900 px-4">
                      <BiEdit />
                    </button>
                    {/* <button onClick={() => openDeleteModal(tax)} className="text-red-600 hover:text-red-900 px-4">
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
        title={currentTax ? 'Edit Tax' : 'Add Tax'}
        content={<TaxForm initialData={currentTax} onSubmit={handleSubmit} onCancel={handleClose} />}
      />
      <Modal
        visible={deleteModalVisible}
        onClose={handleClose}
        title="Confirm Delete"
        content={
          <div>
            <p>Are you sure you want to delete this Tax?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={handleClose} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded">
                Delete
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default TaxComponent;

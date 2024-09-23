import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiEdit, BiTrash, BiSearch } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { createExpenseType, deleteExpenseType, fetchExpenseTypes, updateExpenseType } from '../../../../redux/features/DataManageSlices/ExpenceTypeSlice';
import Modal from '../../../../components/commoncomponents/Modal';
import { ExpenseForm } from './ExpenseForm';

const ExpenseTypes = () => { // Rename the component function
    const dispatch = useDispatch();
    const { expenseTypes, loading } = useSelector(state => state?.expenseTypes); // Update selector to use expenseTypes
    const [showModal, setShowModal] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [currentExpenseType, setCurrentExpenseType] = useState(null); // Update variable name
    const [expenseTypeToDelete, setExpenseTypeToDelete] = useState(null); // Update variable name
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expenseTypesPerPage] = useState(10); // Update variable name

    useEffect(() => {
        dispatch(fetchExpenseTypes());
    }, [dispatch]);

    // Ensure expenseTypes is an array before filtering, default to an empty array if undefined
    const filteredExpenseTypes = (expenseTypes || [])?.filter(expenseType =>
        expenseType?.expense_type?.toLowerCase().includes(search?.toLowerCase())
    );

    const indexOfLastExpenseType = currentPage * expenseTypesPerPage;
    const indexOfFirstExpenseType = indexOfLastExpenseType - expenseTypesPerPage;
    const currentExpenseTypes = filteredExpenseTypes?.slice(indexOfFirstExpenseType, indexOfLastExpenseType);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredExpenseTypes.length / expenseTypesPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleAdd = () => {
        setCurrentExpenseType(null);
        setShowModal(true);
    };

    const handleEdit = (expenseType) => {
        setCurrentExpenseType(expenseType);
        setShowModal(true);
    };

    const openDeleteModal = (expenseType) => {
        setExpenseTypeToDelete(expenseType);
        setDeleteModalVisible(true);
    };

    const handleDelete = () => {
        dispatch(deleteExpenseType(expenseTypeToDelete.id)); // Update action call
        setDeleteModalVisible(false);
    };

    const handleSubmit = (data) => {
        if (currentExpenseType) {
            dispatch(updateExpenseType({ id: currentExpenseType.id, ...data })).then((res)=>{
                toast.success(res.payload.suceess)
              })
        } else {
            dispatch(createExpenseType(data)).then((res)=>{
                toast.success(res.payload.success)
              })
        }
        setShowModal(false);
    };

    const handleClose = () => {
        setShowModal(false);
        setDeleteModalVisible(false);
    };

    if (loading) {
        return <div>Loading expense types...</div>;
    }


    return (
        <div className="container mx-auto  sm:px-8 pt-6 pb-2">
            <div className="">
                <h2 className="text-xl mb-2 font-medium leading-tight">Expense Types</h2>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search expense types..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
                        />
                        <BiSearch className="text-gray-500 ml-2 my-auto"/>
                    </div>
                    <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                        Add Expense Type
                    </button>
                </div>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                   ID
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Expense Type Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentExpenseTypes.map(expenseType => (
                                <tr key={expenseType.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {expenseType.id}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {expenseType.expense_type}
                                    </td>
                                    <td className="px-5 py-6 border-b border-gray-200 bg-white text-sm flex justify-end items-center">
                                        <button onClick={() => handleEdit(expenseType)} className="text-indigo-600 hover:text-indigo-900 px-4">
                                            <BiEdit />
                                        </button>
                                        {/* <button onClick={() => openDeleteModal(expenseType)} className="text-red-600 hover:text-red-900 px-4">
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
                visible={showModal}
                onClose={handleClose}
                title={currentExpenseType ? 'Edit Expense Type' : 'Add Expense Type'}
                content={<ExpenseForm initialData={currentExpenseType} onSubmit={handleSubmit} onCancel={handleClose} />} // Update component name
            />
            <Modal
                visible={deleteModalVisible}
                onClose={handleClose}
                title="Confirm Delete"
                content={
                    <div>
                        <p>Are you sure you want to delete this expense type?</p>
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

export default ExpenseTypes;

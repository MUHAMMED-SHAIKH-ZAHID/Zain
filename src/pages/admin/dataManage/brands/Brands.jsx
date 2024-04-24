import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrand, deleteBrand, fetchBrands, updateBrand } from '../../../../redux/features/DataManageSlices/BrandSlice';
import Modal from '../../../../components/commoncomponents/Modal';
import { BrandForm } from './BrandForm';
import { BiEdit, BiTrash, BiSearch } from 'react-icons/bi';


const Brands = () => {
    const dispatch = useDispatch();
    const { brands, loading } = useSelector(state => state?.brands?.brands);
    const [showModal, setShowModal] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [currentBrand, setCurrentBrand] = useState(null);
    const [brandToDelete, setBrandToDelete] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [brandsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    // Ensure brands is an array before filtering, default to an empty array if undefined
    const filteredBrands = (brands || []).filter(brand =>
        brand.name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastBrand = currentPage * brandsPerPage;
    const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
    const currentBrands = filteredBrands.slice(indexOfFirstBrand, indexOfLastBrand);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredBrands.length / brandsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleAdd = () => {
        setCurrentBrand(null);
        setShowModal(true);
    };

    const handleEdit = (brand) => {
        setCurrentBrand(brand);
        setShowModal(true);
    };

    const openDeleteModal = (brand) => {
        setBrandToDelete(brand);
        setDeleteModalVisible(true);
    };

    const handleDelete = () => {
        dispatch(deleteBrand(brandToDelete.id));
        setDeleteModalVisible(false);
    };

    const handleSubmit = (data) => {
        if (currentBrand) {
            dispatch(updateBrand({ id: currentBrand.id, ...data }));
        } else {
            dispatch(createBrand(data));
        }
        setShowModal(false);
    };

    const handleClose = () => {
        setShowModal(false);
        setDeleteModalVisible(false);
    };

    if (loading) {
        return <div>Loading brands...</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 py-4">
            <div className="py-8">
                <h2 className="text-2xl font-semibold leading-tight">Brands</h2>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search brands..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
                        />
                        <BiSearch className="text-gray-500 ml-2 my-auto"/>
                    </div>
                    <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Brand
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
                        {currentBrands.map(brand => (
                            <tr key={brand.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {brand.name}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex justify-end items-center">
                                    <button onClick={() => handleEdit(brand)} className="text-indigo-600 hover:text-indigo-900 px-4">
                                        <BiEdit />
                                    </button>
                                    <button onClick={() => openDeleteModal(brand)} className="text-red-600 hover:text-red-900 px-4">
                                        <BiTrash />
                                    </button>
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
                title={currentBrand ? 'Edit Brand' : 'Add Brand'}
                content={<BrandForm initialData={currentBrand} onSubmit={handleSubmit} onCancel={handleClose} />}
            />
            <Modal
                visible={deleteModalVisible}
                onClose={handleClose}
                title="Confirm Delete"
                content={
                    <div>
                        <p>Are you sure you want to delete this brand?</p>
                        <div className="flex justify-end space-x-4">
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

export default Brands;




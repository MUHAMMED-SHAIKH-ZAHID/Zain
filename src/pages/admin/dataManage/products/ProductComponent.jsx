import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../../../redux/features/DataManageSlices/ProductSlice';
import { BiEdit, BiTrash, BiSearch } from 'react-icons/bi';
import EditProduct from './EditProduct';
import Modal from '../../../../components/commoncomponents/Modal';
import CreateProduct from './CreateProduct';

const Products = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector(state => state?.products);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [search, setSearch] = useState('');
   console.log(products,"the products")
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredProducts = (products || []).filter(product =>
        product?.product_name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);


   

    const handleCloseEditModal = () => {
        setShowEditModal(false);
      };
    const handleEdit = (product) => {
        console.log(product,"debugging handle edit")
        setCurrentProduct(product);
        setEditData(product);
        setShowEditModal(true); // Open the modal when edit is clicked
    };

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setDeleteModalVisible(true);
    };

    const handleDelete = () => {
        dispatch(deleteProduct(productToDelete.id));
        setDeleteModalVisible(false);
    };

    const [showCreateModal, setShowCreateModal] = useState(false);

  const openModal = () => setShowCreateModal(true);
  const closeModal = () => setShowCreateModal(false);

    const handleClose = () => {
        setModalVisible(false);
        setDeleteModalVisible(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container border-2 mt-4 rounded-md mx-auto bg-zinc-100  sm:px-6 pt-6 pb-2">
        <div className="">
            <h2 className="text-xl mb-2 font-medium leading-tight">Products</h2>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search products..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
                        />
                        <BiSearch className="text-gray-500 ml-2 my-auto" />
                    </div>
                    <button onClick={openModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold leading-none py-2 px-4 rounded">
                        Add New Product
                    </button>
                </div>
                <table className="min-w-full leading-normal">
    <thead>
        <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Code
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                 name
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Brand
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                EAN Code
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                 Gst            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                HSN 
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                MRP
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[.6rem] font-semibold text-gray-600 uppercase tracking-wider">
                 Price 1
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[.6rem] font-semibold text-gray-600 uppercase tracking-wider">
                 Price 2
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[.6rem] font-semibold text-gray-600 uppercase tracking-wider">
                 Price 3
            </th>
         
            <th className="px-5 py-3 border-b-2 border-gray-200 text-end bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
            </th>
        </tr>
    </thead>
    <tbody>
        {currentProducts?.map(product => (
            <tr key={product?.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product?.product_code}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product?.product_name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product?.brand_name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product?.category_name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product?.ean_code}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product?.hsn_code}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product?.tax_rate}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {product?.mrp =='' ? "0" : product?.mrp}

                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {product?.s_rate_1 == null ? "0" : product?.s_rate_1}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {product?.s_rate_2 ==null ? "0" : product?.s_rate_2}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product?.s_rate_3 == null ? "0" : product?.s_rate_3}
                </td>
               
                <td className="bg-white border-b">
                    <div className="px-5 py-6  h-full border-gray-200 bg-white text-sm flex justify-end items-center">

                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 px-4">
                        <BiEdit />
                    </button>
                    {/* <button onClick={() => openDeleteModal(product)} className="text-red-600 hover:text-red-900 px-4">
                        <BiTrash />
                    </button> */}
                    </div>
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
            
            <Modal
                visible={deleteModalVisible}
                onClose={handleClose}
                title="Confirm Delete"
                content={<div>
                    <p>Are you sure you want to delete this product?</p>
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

{showEditModal && (
                <EditProduct
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    data={editData}
                />
            )}
                  {showCreateModal && <CreateProduct show={showCreateModal} handleClose={closeModal} />}

        </div>
    );
};

export default Products;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../../../redux/features/DataManageSlices/ProductSlice';
import { BiEdit, BiTrash, BiSearch } from 'react-icons/bi';
import EditProduct from './EditProduct';
import Modal from '../../../../components/commoncomponents/Modal';
import CreateProduct from './CreateProduct';
import DataTable from '../../../../components/table/DataTable';
import { productColumns } from '../../../../components/table/columns/ProductColumns';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';

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

    useEffect(() => {
        dispatch(setHeading("Products"));
        dispatch(fetchProducts());
        return () => {
          dispatch(clearHeading());
        };
      }, [dispatch]);

    const filteredProducts = (products || []).filter(product =>
        product?.product_name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts?.slice(indexOfFirstProduct, indexOfLastProduct);

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
    const columns = productColumns(handleEdit);
    if (loading) return <div>Loading...</div>;

    return (
        <div className=" ">
             <DataTable
        data={products}
        columns={columns}
        filterColumn="brand_name"
        title={'Product'}
      />
      
            
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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../../../../redux/features/DataManageSlices/CategorySlice';
import { CategoryForm } from './CategoryForm';
import Modal from '../../../../components/commoncomponents/Modal';


const Categories = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const categories = useSelector(state => state?.categories?.categories?.categories);
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(fetchCategories());
    }, [dispatch]);
  
    const handleCreate = () => {
      setCurrentCategory(null);
      setModalVisible(true);
    };
  
    const handleEdit = (category) => {
      setCurrentCategory(category);
      setModalVisible(true);
    };
  
    const openDeleteModal = (category) => {
      setCategoryToDelete(category);
      setDeleteModalVisible(true);
    };
  
    const handleDelete = () => {
      dispatch(deleteCategory(categoryToDelete.id));
      setDeleteModalVisible(false);
    };
  
    const handleSubmit = (data) => {
      if (currentCategory) {
        dispatch(updateCategory({ id: currentCategory.id, ...data }));
      } else {
        dispatch(createCategory(data));
      }
      setModalVisible(false);
    };
  
    const handleClose = () => {
      setModalVisible(false);
      setDeleteModalVisible(false);
    };
  
    return (
      <div className="flex justify-between">
        <div className="w-1/2 p-4 shadow-md">
          <button onClick={handleCreate} className="mb-4 bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-700">Add New Category</button>
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {cat.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button onClick={() => handleEdit(cat)} className="text-indigo-600 hover:text-indigo-900 px-4">Edit</button>
                    <button onClick={() => openDeleteModal(cat)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          visible={modalVisible}
          onClose={handleClose}
          id="category-modal"
          title={currentCategory ? 'Edit Category' : 'Add Category'}
          content={<CategoryForm initialData={currentCategory} onSubmit={handleSubmit} onCancel={handleClose} />}
        />
        <Modal
          visible={deleteModalVisible}
          onClose={handleClose}
          id="delete-category-modal"
          title="Confirm Delete"
          content={<div>
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end space-x-4">
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
  
  export default Categories;
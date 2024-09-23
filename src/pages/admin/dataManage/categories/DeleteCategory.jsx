import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteCategory } from '../../../../redux/features/DataManageSlices/CategorySlice';

const DeleteCategory = ({ id }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <button onClick={handleDelete}>Delete Category</button>
  );
};

export default DeleteCategory;

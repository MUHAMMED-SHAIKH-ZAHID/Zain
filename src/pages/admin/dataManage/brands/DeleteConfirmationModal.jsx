import React from 'react';
import Modal from '../../../../components/commoncomponents/Modal';

const DeleteConfirmationModal = ({ visible, onClose, onDelete, item }) => {
    console.log(item,"deleet modal")
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Confirm Deletion"
      content={
        <div>
          <p>Are you sure you want to delete {item ? item.name : 'this item'}?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded">
              Cancel
            </button>
            <button onClick={() => onDelete(item.id)} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">
              Delete
            </button>
          </div>
        </div>
      }
    />
  );
};

export default DeleteConfirmationModal;

import { AiOutlineWarning } from 'react-icons/ai'; // Importing warning icon from react-icons
import Modal from '../../../../components/commoncomponents/Modal';

const DeleteSales = ({ show, handleClose, handleDelete, itemId }) => {
  return (
    <Modal
      visible={show}
      onClose={handleClose}
      id="deleteConfirmationModal" 
      title="Confirm Deletion"
      content={(
        <div className="text-center p-4">
          <div className="flex justify-center items-center text-red-500 mb-4">
            <AiOutlineWarning className="text-3xl" />
          </div>
          <p className="text-lg font-semibold text-gray-800">Are you sure you want to delete this item?</p>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => { handleDelete(itemId); handleClose(); }}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded focus:outline-none shadow"
            >
              Delete
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none shadow"
            >
              Cancel
            </button> 
          </div>
        </div>
      )}
    />
  );
};

export default DeleteSales;

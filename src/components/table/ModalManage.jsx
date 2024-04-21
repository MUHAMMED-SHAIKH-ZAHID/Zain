import { useState } from "react";
import Modal from "../commoncomponents/Modal"
import AddSupplier from "../../pages/admin/supplier/AddSupplier";

const ModalManage = ({title}) => {
    const [showAddModal, setAddShowModal] = useState(false);
    const handleCloseModal = () => {
      setAddShowModal(false);
    };
  return (
    <div>
        {title == 'supplier' && 
             <button onClick={() => setAddShowModal(true)} className="bg-blue-500 text-white p-2 rounded">
             Add Supplier
           </button>
        }
         {showAddModal && (
        <Modal
          visible={showAddModal}
          onClose={handleCloseModal}
          id="add-supplier-modal"
          title="Add New Supplier"
          content={<AddSupplier handleClose={handleCloseModal} />}
        />
      )}
    </div>
  )
}

export default ModalManage
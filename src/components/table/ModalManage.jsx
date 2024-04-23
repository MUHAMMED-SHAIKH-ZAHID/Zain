import { useState } from "react";
import Modal from "../commoncomponents/Modal"
import AddSupplier from "../../pages/admin/supplier/AddSupplier";
import { useNavigate } from "react-router-dom";
import CreateSalesExecutive from "../../pages/admin/salesexecutive/CreateSalesExecutive";
import AddCustomer from "../../pages/admin/customer/AddCustomer";

const ModalManage = ({title}) => {
  const navigate = useNavigate()
    const [showAddModal, setAddShowModal] = useState(false);
    const handleCloseModal = () => {
      setAddShowModal(false);
    };
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
      setShowModal(true);
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
     {title == 'Purchase' && 
             <button onClick={() => navigate('/purchase/create')} className="bg-blue-500 text-white p-2 rounded">
             Add Purchase
           </button>
        }
      {title == 'Sales Executive' && 
             <button onClick={() => setAddShowModal(true)} className="bg-blue-500 text-white p-2 rounded">
             Add Sales Executive
           </button>
        }
         {showAddModal && (
        <Modal
          visible={showAddModal}
          onClose={handleCloseModal}
          id="add-sales-executive-modal"
          title="Add New Sales Executive"
          content={<CreateSalesExecutive handleClose={handleCloseModal} />}
        />
      )}
      {title == 'Customer' && 
             <button onClick={() => setAddShowModal(true)} className="bg-blue-500 text-white p-2 rounded">
             Add Customer
           </button>
        }
         {showAddModal && (
        <Modal
          visible={showAddModal}
          onClose={handleCloseModal}
          id="add-customer-modal"
          title="Add New Customer"
          content={<AddCustomer handleClose={handleCloseModal} />}
        />
      )}

    </div>
  )
}

export default ModalManage
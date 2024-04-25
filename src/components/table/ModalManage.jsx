import { useState } from "react";
import Modal from "../commoncomponents/Modal";
import AddSupplier from "../../pages/admin/supplier/AddSupplier";
import { useNavigate } from "react-router-dom";
import CreateSalesExecutive from "../../pages/admin/salesexecutive/CreateSalesExecutive";
import AddCustomer from "../../pages/admin/customer/AddCustomer";

const ModalManage = ({ title }) => {
    const navigate = useNavigate();
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showSalesExecutiveModal, setShowSalesExecutiveModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    const handleCloseSupplierModal = () => setShowSupplierModal(false);
    const handleCloseSalesExecutiveModal = () => setShowSalesExecutiveModal(false);
    const handleCloseCustomerModal = () => setShowCustomerModal(false);

    return (
        <div>
            {title === 'supplier' && 
                <button onClick={() => setShowSupplierModal(true)} className="bg-blue-500 text-white p-2 rounded">
                    Add Supplier
                </button>
            }
            {showSupplierModal && (
                <Modal
                    visible={showSupplierModal}
                    onClose={handleCloseSupplierModal}
                    id="add-supplier-modal"
                    title="Add New Supplier"
                    content={<AddSupplier handleClose={handleCloseSupplierModal} />}
                />
            )}
            {title === 'Purchase' && 
                <button onClick={() => navigate('/purchase/create')} className="bg-blue-500 text-white p-2 rounded">
                    Add Purchase
                </button>
            }
            {title === 'Sales Executive' && 
                <button onClick={() => setShowSalesExecutiveModal(true)} className="bg-blue-500 text-white p-2 rounded">
                    Add Sales Executive
                </button>
            }
            {showSalesExecutiveModal && (
                <Modal
                    visible={showSalesExecutiveModal}
                    onClose={handleCloseSalesExecutiveModal}
                    id="add-sales-executive-modal"
                    title="Add New Sales Executive"
                    content={<CreateSalesExecutive handleClose={handleCloseSalesExecutiveModal} />}
                />
            )}
            {title === 'Customer' && 
                <button onClick={() => setShowCustomerModal(true)} className="bg-blue-500 text-white p-2 rounded">
                    Add Customer
                </button>
            }
            {showCustomerModal && (
                <Modal
                    visible={showCustomerModal}
                    onClose={handleCloseCustomerModal}
                    id="add-customer-modal"
                    title="Add New Customer"
                    content={<AddCustomer handleClose={handleCloseCustomerModal} />}
                />
            )}
        </div>
    );
}

export default ModalManage;

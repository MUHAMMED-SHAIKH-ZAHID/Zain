import { useState } from "react";
import Modal from "../commoncomponents/Modal";
import AddSupplier from "../../pages/admin/vendor/AddVendor";
import { useNavigate } from "react-router-dom";
import CreateSalesExecutive from "../../pages/admin/salesexecutive/CreateSalesExecutive";
import AddCustomer from "../../pages/admin/customer/AddCustomer";
import AddExpense from "../../pages/admin/purchase/expense/AddExpense";
import PurchasePaymentModal from "../../pages/admin/payment/PaymentPurchaseModal";

const ModalManage = ({ title }) => {
    const navigate = useNavigate();
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showSalesExecutiveModal, setShowSalesExecutiveModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleCloseSupplierModal = () => setShowSupplierModal(false);
    const handleCloseExpenseModal = () => setShowExpenseModal(false);
    const handleCloseSalesExecutiveModal = () => setShowSalesExecutiveModal(false);
    const handleCloseCustomerModal = () => setShowCustomerModal(false);
    const handleClosePaymentModal = () => setShowPaymentModal(false);

    return (
        <div>
            {title === 'vendor' && 
                <button onClick={() => setShowSupplierModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.9rem]   p-[.7rem] leading-none    rounded">
                    Add Vendor
                </button>
            }
            {showSupplierModal && (
                <Modal
                    visible={showSupplierModal}
                    onClose={handleCloseSupplierModal}
                    id="add-vendor-modal"
                    title="Create New Vendor"
                    content={<AddSupplier handleClose={handleCloseSupplierModal} />}
                />
            )}
            {title === 'Expense' && 
                <button onClick={() => setShowExpenseModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.9rem]   p-[.7rem] leading-none    rounded">
                    Add Expense
                </button>
            }
            {showExpenseModal && (
                <Modal
                    visible={showExpenseModal}
                    onClose={handleCloseExpenseModal}
                    id="add-expenses-modal"
                    title="Create New Expense"
                    content={<AddExpense handleClose={handleCloseExpenseModal} />}
                />
            )}
            {title === 'Payment' && 
                <button onClick={() => setShowExpenseModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.9rem]   p-[.7rem] leading-none    rounded">
                    Add Payment
                </button>
            }
            {showPaymentModal && (
                <Modal
                    visible={showPaymentModal}
                    onClose={handleClosePaymentModal}
                    id="add-payment-modal"
                    title="Create New Expense"
                    content={<PurchasePaymentModal handleClose={handleClosePaymentModal} />}
                />
            )}
            {title === 'Bill' && 
                <button onClick={() => navigate('/purchase/create')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.9rem] p-[.7rem] leading-none  rounded">
                    Add Purchase Bill
                </button>
            }
            {title === 'Create P O' && 
                <button onClick={() => navigate('/purchase/order/create')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.9rem] p-[.7rem] leading-none  rounded">
                    Create Purchase Order
                </button>
            }
            {title === 'Sales Quote' && 
                <button onClick={() => navigate('/sales/quotation/create')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.9rem] p-[.7rem] leading-none  rounded">
                    Add Sales Quote
                </button>
            }
            {title === 'Sales' && 
                <button onClick={() => navigate('/sales/create')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.9rem] p-[.7rem] leading-none  rounded">
                    Add Sales
                </button>
            }
            {title === 'Sales Executive' && 
                <button onClick={() => setShowSalesExecutiveModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.9rem] p-[.7rem] leading-none  rounded">
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
                <button onClick={() => setShowCustomerModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.9rem] p-[.7rem] leading-none  rounded">
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

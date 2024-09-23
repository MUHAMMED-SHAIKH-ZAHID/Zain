import { useState } from "react";
import Modal from "../commoncomponents/Modal";
import AddSupplier from "../../pages/admin/vendor/AddVendor";
import { useNavigate } from "react-router-dom";
import CreateSalesExecutive from "../../pages/admin/salesexecutive/CreateSalesExecutive";
import AddExpense from "../../pages/admin/purchase/expense/AddExpense";
import Modal2 from "../commoncomponents/Modal2";
import AddPayment from "../../pages/admin/payment/AddPayment";
import CreateProduct from "../../pages/admin/dataManage/products/CreateProduct";
import AddCustomer from "../../pages/admin/customer/AddCustomer";
import AddEecutiveCustomer from "../../pages/executive/customer/AddEecutiveCustomer";
import AddExecutivePayment from "../../pages/executive/payment/AddExecutivePayment";

const ModalManage = ({ title }) => {
    const navigate = useNavigate();
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showSalesExecutiveModal, setShowSalesExecutiveModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showCustomersModal, setShowCustomersModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSEPaymentModal, setShowSEPaymentModal] = useState(false);
    // const [showStockModal, setShowStockModal] = useState(false);

    const handleCloseSupplierModal = () => setShowSupplierModal(false);
    const handleCloseProductModal = () => setShowProductModal(false);
    const handleCloseExpenseModal = () => setShowExpenseModal(false);
    const handleCloseSalesExecutiveModal = () => setShowSalesExecutiveModal(false);
    const handleCloseCustomerModal = () => setShowCustomerModal(false);
    const handleCloseCustomersModal = () => setShowCustomersModal(false);
    const handleClosePaymentModal = () => setShowPaymentModal(false);
    const handleCloseSEPaymentModal = () => setShowSEPaymentModal(false);
    // const handleCloseStockModal = () => setShowStockModal(false);

    return (
        <div>
            {title === 'vendor' && 
                <button onClick={() => setShowSupplierModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]  p-[.5rem] md:p-[.7rem] leading-none    rounded">
                    Add Vendor
                </button>
            }
            {showSupplierModal && (
                <Modal2
                    visible={showSupplierModal}
                    onClose={handleCloseSupplierModal}
                    id="add-vendor-modal"
                    title="Create New Vendor"
                    content={<AddSupplier handleClose={handleCloseSupplierModal}/> }
                size = 'big'
                />
          
        
            )}
            {title === 'Product' && 
                <button onClick={() => setShowProductModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]  p-[.5rem] md:p-[.7rem] leading-none    rounded">
                    Add Product
                </button>
            }
            {showProductModal && (
                <Modal2
                    visible={showProductModal}
                    onClose={handleCloseProductModal}
                    id="add-productx-modal"
                    title="Create New Product"
                    content={<CreateProduct handleClose={handleCloseProductModal}/> }
                size = 'big'
                />
          
        
            )}
            {title === 'Expense' && 
                <button onClick={() => setShowExpenseModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]  p-[.5rem] md:p-[.7rem] leading-none    rounded">
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
                <button onClick={() => setShowPaymentModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]  p-[.5rem] md:p-[.7rem] leading-none    rounded">
                    Add Payment
                </button>
            }
            {showPaymentModal && (
                <Modal
                    visible={showPaymentModal}
                    onClose={handleClosePaymentModal}
                    id="add-payments-modal"
                    title="Create New Payment"
                    content={<AddPayment handleClose={handleClosePaymentModal} />}
                />
            )}
            {title === 'Payments' && 
                <button onClick={() => setShowSEPaymentModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]  p-[.5rem] md:p-[.7rem] leading-none    rounded">
                    Add Payment
                </button>
            }
            {showSEPaymentModal && (
                <Modal
                    visible={showSEPaymentModal}
                    onClose={handleCloseSEPaymentModal}
                    id="add-payments-modal"
                    title="Create New Payment"
                    content={<AddExecutivePayment handleClose={handleCloseSEPaymentModal} />}
                />
            )}
            {title == 'stock' && 
                <button onClick={() => navigate('/stock/update/')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]  p-[.5rem] md:p-[.7rem] leading-none    rounded">
                    Update Stock
                </button>
            }
            {/* {showStockModal && (
                <Modal
                    visible={showStockModal}
                    onClose={handleCloseStockModal}
                    id="add-stock-modal"
                    title="Update Stock"
                    content={<AddPayment handleClose={handleCloseStockModal} />}
                />
            )} */}
            {title === 'Bill' && 
                <button onClick={() => navigate('/purchase/create')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]p-[.5rem] md:p-[.7rem] leading-none  rounded">
                    Add Purchase Bill
                </button>
            }
            {title === 'Create P O' && 
                <button onClick={() => navigate('/purchase/order/create')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]p-[.5rem] md:p-[.7rem] leading-none  rounded">
                    Create Purchase Order
                </button>
            }
            {title === 'debitNotes' && 
                <button onClick={() => navigate('/debitnote/add')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]p-[.5rem] md:p-[.7rem] leading-none  rounded">
                    Add Debit Note
                </button>
            }
            {title === 'creditNotes' && 
                <button onClick={() => navigate('/creditnote/add')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]p-[.5rem] md:p-[.7rem] leading-none  rounded">
                    Add Credit Note
                </button>
            }
            {title === 'Invoice Order' && 
                <button onClick={() => navigate('/invoice/order/create')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]p-[.5rem] md:p-[.7rem] leading-none  rounded">
                    Add Invoice Order
                </button>
            }
            {title === 'Invoice Orders' && 
                <button onClick={() => navigate('/executive/invoice/order/create')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]p-[.5rem] md:p-[.7rem] leading-none  rounded">
                    Add Invoice Order
                </button>
            }
            {title === 'Invoice' && 
                <button onClick={() => navigate('/invoice/create')} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]p-[.5rem] md:p-[.7rem] leading-none  rounded">
                    Add Invoice
                </button>
            }
            {title === 'Sales Executive' && 
                <button onClick={() => setShowSalesExecutiveModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]p-[.5rem] md:p-[.7rem] leading-none  rounded">
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
                <button onClick={() => setShowCustomerModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem]p-[.5rem] md:p-[.7rem] leading-none  rounded">
                    Add Customer
                </button>
            }
            {showCustomerModal && (
                <Modal2
                    visible={showCustomerModal}
                    onClose={handleCloseCustomerModal}
                    id="add-customer-modal"
                    title="Add New Customer"
                    content={<AddCustomer handleClose={handleCloseCustomerModal} />}
                    size = 'big'
                />
            )}
            {title === 'Customers' && 
                <button onClick={ () => setShowCustomersModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-[.8rem] p-1 md:p-[.5rem] md:p-[.7rem] leading-none  rounded">
                    Add Customers
                </button>
            }
            {showCustomersModal && (
                <Modal2
                    visible={showCustomersModal}
                    onClose={handleCloseCustomersModal}
                    id="add-customers-modal"
                    title="Add New Customer"
                    content={<AddEecutiveCustomer handleClose={handleCloseCustomersModal} />}
                    size = 'big'
                />
            )}
        </div>
    );
}

export default ModalManage;

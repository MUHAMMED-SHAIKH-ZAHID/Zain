import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../../redux/features/HeadingSlice";
import DataTable from "../../../../components/table/DataTable";
import { PurchaseColumns } from "../../../../components/table/columns/PurchaseColumns";
import DeletePurchase from "./DeletePurchase";
import { deletePurchase, editPurchaseId, fetchAllPurchases, viewPurchaseData } from "../../../../redux/features/PurchaseSlice";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import RetutnForm from "./ReturnForm";
import { useReactToPrint } from "react-to-print";
import PrintPurchase from "./PrintPurchase";

const Purchase = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAllPurchases());
  }, [dispatch]);
  const { purchases, loading, error } = useSelector((state) => state?.purchases);
 console.log(purchases,"purchase page debug")
  
  useEffect(() => {
    dispatch(setHeading("Purchase"));
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [showReturnModal,setShowReturnModal] = useState(null)
const [viewData,setViewData] = useState(null)

const handleClosePaymentModal =()=>{
  setShowPaymentModal(false)
}
const handleCloseReturnModal = () => {
  setShowReturnModal(false);
  };

  const deleteClickHandler = (rowData) => {
    setDeleteItemId(rowData.id);
    setShowDeleteModal(true);
    console.log("Deleting item with id:", rowData);
  };

  const handleDelete = (id) => {
    dispatch(deletePurchase(id)); // Assuming deletePurchase is your redux thunk/action creator
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const editClickHandler = (id) => {
    console.log(id,"id to edite")
    dispatch(editPurchaseId(id))
    navigate('/purchase/edit')
  }
  const viewClickHandler = (id) => {
    console.log(id,"checkign view data before trnasfre")
    dispatch(viewPurchaseData(id))
    navigate('/purchase/view')
  }

  const paymentActionClick   = (id) => {
    console.log(id,"checkign view data before trnasfre")
    setPaymentData(id)
    setShowPaymentModal(true)
   
  }
  const returnClickHandler = (id) => {
    console.log(id,"checkign view data before trnasfre")
    setViewData(id)
    setShowReturnModal(true)
  }
  const [showPrint,setShowPrint] = useState(true)
  const componentRef = useRef(null);
  const handlePrintfun = () => {
    setShowPrint(false); // Hide elements
    setTimeout(() => {
      handlePrint(); // Trigger print operation
      setTimeout(() => {
        setShowPrint(true); // Restore visibility after printing
      }, 10 ); // You might adjust this timeout based on your needs
    }, 0);
  };
        
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => setShowPrint(false),
    onAfterPrint: () =>  setShowPrint(true),
  });
  const printClickHandler = (id) => {
    console.log(id,"checkign view data before trnasfre")
    dispatch(viewPurchaseData(id))
    handlePrintfun()
  }


  const columns = PurchaseColumns(paymentActionClick,returnClickHandler,viewClickHandler,editClickHandler,printClickHandler,deleteClickHandler);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-hidden">
      {purchases?.length > 0 ? (
        <DataTable
          data={purchases}
          columns={columns}
          filterColumn="supplier_name"
          title={'Purchases'}
        />
      ) : (
        <div>No purchases available.</div>
      )}
      {showDeleteModal && (
        <DeletePurchase
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDelete}
          itemId={deleteItemId}
        />
      )}
                {showPaymentModal && (
                <PaymentModal
                    show={showPaymentModal}
                    handleClose={handleClosePaymentModal}
                    data={paymentData}
                />
            )}
                    {showReturnModal && (
                <RetutnForm
                    show={showReturnModal}
                    handleClose={handleCloseReturnModal}
                    data={viewData}
                />
            )}
                      {!showPrint &&
          <div className="absolute left-[100rem]">

      <div ref={componentRef} className="">
        <PrintPurchase />
      </div>
          </div>      
      }
            
    </div>
  );
};

export default Purchase;

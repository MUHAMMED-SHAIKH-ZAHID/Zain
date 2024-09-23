import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../../redux/features/HeadingSlice";
import DataTable from "../../../../components/table/DataTable";
import { PurchaseColumns } from "../../../../components/table/columns/PurchaseColumns";
import DeletePurchase from "./DeletePurchase";
import { deletePurchase, editPurchaseId, fetchAllPurchases, printPurchaseData, viewPurchaseData } from "../../../../redux/features/PurchaseSlice";
import { useNavigate } from "react-router-dom";
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
  
  useEffect(() => {
    dispatch(setHeading("Purchase Bill"));
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
  };

  const handleDelete = (id) => {
    dispatch(deletePurchase(id)); // Assuming deletePurchase is your redux thunk/action creator
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const editClickHandler = (id) => {
    dispatch(editPurchaseId(id))
    navigate('/purchase/edit')
  }
  const viewClickHandler = (id) => {
    dispatch(viewPurchaseData(id))
    navigate('/purchase/view')
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
    dispatch(printPurchaseData(id))
    handlePrintfun()
  }


  const columns = PurchaseColumns(viewClickHandler,printClickHandler,deleteClickHandler);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-hidden">
    
        <DataTable
          data={purchases}
          columns={columns}
          filterColumn="supplier_name"
          title={'Bill'}
        />
  
      {showDeleteModal && (
        <DeletePurchase
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDelete}
          itemId={deleteItemId}
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

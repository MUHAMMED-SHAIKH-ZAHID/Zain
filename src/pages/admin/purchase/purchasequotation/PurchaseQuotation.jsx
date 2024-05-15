import { useEffect, useRef, useState } from "react";
import { clearHeading, setHeading } from "../../../../redux/features/HeadingSlice";
import DataTable from "../../../../components/table/DataTable";
import { PurchaseQuotationColumns } from "../../../../components/table/columns/PurchaseQuotationColumns";
import { useNavigate } from "react-router-dom";
import { PurchaseQuotationEdit, PurchaseQuotationView, convertPurchase, deletePurchasequotation, fetchAllPurchasequotations } from "../../../../redux/features/PurchaseQuotationSlice";
import DeletePurchase from "../purchase/DeletePurchase";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import PrintPurchaseQuote from "./PrintPurchaseQuote";

const PurchaseQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAllPurchasequotations());
  }, [dispatch]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  
  const { purchase, loading, error } = useSelector((state) => state?.purchaseQuotation);
 console.log(purchase,"purchase page debughhhhhhhhh")
  useEffect(() => {
    dispatch(setHeading("Quotation List"));
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const deleteClickHandler = (rowData) => {
    setDeleteItemId(rowData.id);
    setShowDeleteModal(true);
    console.log("Deleting item with id:", rowData);
  };

  const handleDelete = (id) => {
    dispatch(deletePurchasequotation(id)); // Assuming deletePurchase is your redux thunk/action creator
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const editClickHandler = (id) => {
    console.log(id,"id to edite")
    dispatch(PurchaseQuotationEdit(id))
    navigate('/purchase/quotation/edit')
  }

  const viewClickHandler = (id) => {
    console.log(id,"checkign view data before trnasfre")
    dispatch(PurchaseQuotationView(id))
    navigate('/purchase/quotation/view')
  }
  
  const convertActionClick = (id) => {
    console.log(id,"checkign view data before trnasfre")
    dispatch(convertPurchase(id))
    navigate('/purchase/quotation/convert')
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
    dispatch(PurchaseQuotationView(id))
    handlePrintfun()
  }

  const columns = PurchaseQuotationColumns(convertActionClick,viewClickHandler,editClickHandler,printClickHandler,deleteClickHandler);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-hidden">
      {purchase?.length > 0 ? (
        <DataTable
          data={purchase}
          columns={columns}
          filterColumn="supplier_name"
          title={'Purchase Quote'}
        />
      ) : (
        <div>No purchase Quotation available.</div>
      )}
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
        <PrintPurchaseQuote />
      </div>
          </div>      
      }
    </div>
  );
};

export default PurchaseQuotation;

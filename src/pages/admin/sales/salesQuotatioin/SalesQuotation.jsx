import { useEffect, useRef, useState } from "react";
import { clearHeading, setHeading } from "../../../../redux/features/HeadingSlice";
import DataTable from "../../../../components/table/DataTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DeleteSalesQuotation from "./DeleteSalesQuotation";
import { deleteSalesQuotation, editSalesQuotation, fetchAllSalesQuotations, viewSalesQuotation } from "../../../../redux/features/SalesQuotationSlice";
import { SalesQuotationColumns } from "../../../../components/table/columns/SalesQuotationColumns";
import { useReactToPrint } from "react-to-print";
import { viewSalesData } from "../../../../redux/features/SalesSlice";
import PrintInvoiceOrder from "./PrintInvoiceOrder";

const SalesQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAllSalesQuotations());
  }, [dispatch]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  
  const { sales, loading, error } = useSelector((state) => state?.salesQuotation);
  useEffect(() => {
    dispatch(setHeading("Sales Order"));
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);
  
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const handleDelete = (id) => {
    dispatch(deleteSalesQuotation(id)); // Assuming deletesales is your redux thunk/action creator
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const editClickHandler = (id) => {
    dispatch(editSalesQuotation(id))
    navigate('/invoice/order/edit')
  }

  const viewClickHandler = (id) => {
    dispatch(viewSalesQuotation(id))
    navigate('/invoice/order/view')
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
    dispatch(viewSalesQuotation(id))
    handlePrintfun()
  }

  const columns = SalesQuotationColumns(viewClickHandler,editClickHandler,printClickHandler);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div>
   
        <DataTable
          data={sales}
          columns={columns}
          filterColumn="customer_name"
          title={'Invoice Order'}
        />
   
      {showDeleteModal && (
        <DeleteSalesQuotation
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDelete}
          itemId={deleteItemId}
        />
      )}
        {!showPrint &&
         <div className="absolute left-[100rem]">
      <div ref={componentRef} className="">
        <PrintInvoiceOrder />
      </div>
      </div>
      }
    </div>
  );
};

export default SalesQuotation;

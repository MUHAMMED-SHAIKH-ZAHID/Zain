import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../../redux/features/HeadingSlice";
  import DataTable from "../../../../components/table/DataTable";
import { useNavigate } from "react-router-dom";
import { SalesColumns } from '../../../../components/table/columns/SalesColumns'
import { deleteSale, editSalesId, fetchAllSales, fetchSaleById, viewSalesData } from "../../../../redux/features/SalesSlice";
import DeleteSales from "./DeleteSales";
import SalesPaymentModal from "./SalesPaymentModal";
import { useReactToPrint } from "react-to-print";
import PrintSales from "./PrintSales";

const Sales = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(fetchAllSales());
  }, [dispatch]);
  const { sales, loading, error } = useSelector((state) => state?.sales); // Update to use sales slice
  useEffect(() => {
    dispatch(setHeading("Invoice"));
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handleClosePaymentModal =()=>{
    setShowPaymentModal(false)
  }

  const deleteClickHandler = (rowData) => {
    setDeleteItemId(rowData.id);
    setShowDeleteModal(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteSale(id)); // Use deleteSale action
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };


  const viewClickHandler = (id) => {
    dispatch(fetchSaleById(id.id))
    navigate('/invoice/view')
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
    dispatch(fetchSaleById(id.id))
    handlePrintfun()
  }


  const columns = SalesColumns(viewClickHandler,printClickHandler); 

  return (
    <div className="overflow-x-hidden">
        <DataTable
          data={sales}
          columns={columns}
          title={'Invoice'}
        />
    
      {showDeleteModal && (
        <DeleteSales
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDelete}
          itemId={deleteItemId}
        />
      )}
           {showPaymentModal && (
                <SalesPaymentModal
                    show={showPaymentModal}
                    handleClose={handleClosePaymentModal}
                    data={paymentData}
                />
            )}
                {!showPrint &&
          <div className="absolute left-[100rem]">

      <div ref={componentRef} className="">
        <PrintSales />
      </div>
          </div>      
      }
    </div>
  );
};

export default Sales;

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
  console.log(sales, "sales page debug");
   console.log(sales,"its the data from the backend to sales.jsx page")
  useEffect(() => {
    dispatch(setHeading("Sales"));
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
    console.log("Deleting item with id:", rowData.id);
  };

  const handleDelete = (id) => {
    dispatch(deleteSale(id)); // Use deleteSale action
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const editClickHandler = (id) => {
    console.log(id, "id to edit");
    dispatch(editSalesId(id)); // Use editSaleId action
    navigate('/sales/edit'); // Update navigation path
  };

  const viewClickHandler = (id) => {
    console.log(id,"checkign view data before trnasfre")
    // dispatch(viewSalesData())

    dispatch(fetchSaleById(id.id))

    navigate('/sales/view')
  }

  const paymentActionClick   = (id) => {
    console.log(id,"checkign view data before trnasfre")
    setPaymentData(id)
    setShowPaymentModal(true)
   
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
    dispatch(fetchSaleById(id.id))
    handlePrintfun()
  }


  const columns = SalesColumns(paymentActionClick,viewClickHandler,editClickHandler,printClickHandler, deleteClickHandler); // Assume you have a corresponding SalesColumns

  return (
    <div className="overflow-x-hidden">
        <DataTable
          data={sales}
          columns={columns}
          filterColumn="status" // Assuming you're filtering by customer_name
          title={'slaesss'}
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

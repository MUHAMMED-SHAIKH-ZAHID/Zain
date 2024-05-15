import { useEffect, useRef, useState } from "react";
import { clearHeading, setHeading } from "../../../../redux/features/HeadingSlice";
import DataTable from "../../../../components/table/DataTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DeleteSalesQuotation from "./DeleteSalesQuotation";
import { deleteSalesQuotation, editSalesQuotation, fetchAllSalesQuotations, viewSalesQuotation } from "../../../../redux/features/SalesQuotationSlice";
import { SalesQuotationColumns } from "../../../../components/table/columns/SalesQuotationColumns";
import { useReactToPrint } from "react-to-print";
import SalesQuotePrint from "./SalesQuotePrint";
import { viewSalesData } from "../../../../redux/features/SalesSlice";

const SalesQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAllSalesQuotations());
  }, [dispatch]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  
  const { sales, loading, error } = useSelector((state) => state?.salesQuotation);
 console.log(sales,"sales page debughhhhhhhhh")
  useEffect(() => {
    dispatch(setHeading("Sales Quotation"));
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
    dispatch(deleteSalesQuotation(id)); // Assuming deletesales is your redux thunk/action creator
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const editClickHandler = (id) => {
    console.log(id,"id to edite")
    dispatch(editSalesQuotation(id))
    navigate('/sales/quotation/edit')
  }

  const viewClickHandler = (id) => {
    console.log(id,"checkign view data before trnasfre")
    dispatch(viewSalesQuotation(id))

    navigate('/sales/quotation/view')
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
    dispatch(viewSalesData(id))
    handlePrintfun()
  }

  const columns = SalesQuotationColumns(viewClickHandler,editClickHandler,printClickHandler,deleteClickHandler);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div>
    
      {sales?.length > 0 ? (
        <DataTable
          data={sales}
          columns={columns}
          filterColumn="supplier_name"
          title={'Sales Quote'}
        />
      ) : (
        <div>No sales Quotation available.</div>
      )}
      {showDeleteModal && (
        <DeleteSalesQuotation
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDelete}
          itemId={deleteItemId}
        />
      )}
        {!showPrint &&
      <div ref={componentRef} className="">
        <SalesQuotePrint />
      </div>
      }
    </div>
  );
};

export default SalesQuotation;

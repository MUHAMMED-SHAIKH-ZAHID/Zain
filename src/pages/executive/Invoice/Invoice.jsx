import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
  import DataTable from "../../../components/table/DataTable";
import { useNavigate } from "react-router-dom";
import { SalesColumns } from '../../../components/table/columns/SalesColumns'
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "./PrintInvoice";
import { fetchAllSales, fetchSaleById } from "../../../redux/features/salesExecutive/ExecutiveSalesSlice";

const Invoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(fetchAllSales());
  }, [dispatch]);
  const { sales, loading, error } = useSelector((state) => state?.sales); 

  useEffect(() => {
    dispatch(setHeading("Invoice"));
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const viewClickHandler = (id) => {
    dispatch(fetchSaleById(id.id))
    navigate('/executive/invoice/view')
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
        //   filterColumn="customer_name" 
          title={''}
        />
    
    
        
                {!showPrint &&
          <div className="absolute left-[100rem]">

      <div ref={componentRef} className="">
        <PrintInvoice />
      </div>
          </div>      
      }
    </div>
  );
};

export default Invoice;

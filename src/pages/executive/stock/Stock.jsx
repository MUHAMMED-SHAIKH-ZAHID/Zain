import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import DataTable from "../../../components/table/DataTable";
import { fetchStocks } from "../../../redux/features/salesExecutive/ExecutiveStockSlice";
import { StockColumns } from "../../../components/table/columns/StockColumn";

const Stock = () => {
  const columns = StockColumns();
  const dispatch = useDispatch();

  useEffect(() => {
  
    dispatch(setHeading("Stock"));
    dispatch(fetchStocks())

    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  


  const { stocks, loading, error } = useSelector((state) => state?.stock);

  return (
 
<div className="">

    <DataTable
      data={stocks}
      columns={columns}
      filterColumn="physical_stock"
      title={''}
    />
    {/* <div onClick={()=>   dispatch(fetchStocks())} className="">LOADING ....</div> */}
</div>

   
  );
}

export default Stock;

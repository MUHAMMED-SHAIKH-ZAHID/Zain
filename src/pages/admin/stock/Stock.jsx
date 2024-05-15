import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";

import DataTable from "../../../components/table/DataTable";
import { AccountBookColumns } from "../../../components/table/columns/AccountBookColumn";
import { fetchStocks } from "../../../redux/features/StockSlice";
import Cards2 from "./Cards2";
import { AiOutlineStock } from "react-icons/ai";

const Stock = () => {
  const columns = AccountBookColumns();
  const dispatch = useDispatch();

  useEffect(() => {
  
    dispatch(setHeading("Stock"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log("chekd dispagehj")
    dispatch(fetchStocks())
  }, [])
  


  const { stocks, loading, error } = useSelector((state) => state?.stock);
  console.log(stocks,"Stock details paaaaaaage");



  // Conditionally rendering the DataTable only when stocks is not empty
  return (
 
<div className="">
<div className="bg-white border rounded-lg p-6 mb-4">
      {/* <h2 className="text-3xl font-bold text-gray-800 mb-4">Stock</h2> */}
      <div className="grid grid-cols-4 gap-2">
        
      <Cards2
            heading="Total Stocks"
            amount='562'
            subheading=""
            Icon={AiOutlineStock} // Pass the icon component reference
            bgImage='#DDFFD8' // Provide the background image URL
            textColor='#3A6211'
          />
          <div className=""></div>
          <div className=""></div>
      <Cards2
            heading="Total Damaged and Return"
            amount='2'
            subheading=""
            Icon={AiOutlineStock} // Pass the icon component reference
            bgImage='#EFE1E1' // Provide the background image URL
            textColor='#BE2F2F'
          />
      </div>
      
    </div>
{loading && 
 <div>Loading...</div>
}
{error &&
 <div>Error fetching data: {error}</div>
}
    <DataTable
      data={stocks}
      columns={columns}
      filterColumn="product_name"
      title={'Supplier'}
    />
    {/* <div onClick={()=>   dispatch(fetchStocks())} className="">LOADING ....</div> */}
</div>

   
  );
}

export default Stock;

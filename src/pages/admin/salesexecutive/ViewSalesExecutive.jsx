import { FaMapMarkerAlt, FaMobileAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import profile from '../../../assets/Profile/profile.jpeg'
import DataTable from "../../../components/table/DataTable";
import { fetchCustomer } from "../../../redux/features/CustomerSlice";
import { useNavigate } from "react-router-dom";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { useEffect } from "react";
import { ExecutiveCustomerColumn } from "../../../components/table/columns/ExecutiveCustomerColumn";


const ViewSalesExecutive = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { customers,currentSalesExecutive } = useSelector((state) => state?.salesExecutives);
  const viewClickHandler = (id) => {
    // dispatch(viewSalesData())
    dispatch(fetchCustomer(id.id))
    navigate('/customer/view')
  }
  useEffect(() => {
    dispatch(setHeading("Sales Executive View"));
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);
  const columns = ExecutiveCustomerColumn(viewClickHandler);
  return (
    <div className="">
    <div className=" mx-auto bg-white rounded-lg  border p-6">
      <div className="flex items-center space-x-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
          <img
            className="object-cover w-full h-full"
            src={profile}
            alt="Sales Executive"
          />
        </div>
        <div>
    
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <MdEmail className="text-red-500 mr-2" />
              <span>{currentSalesExecutive?.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaMobileAlt className="text-blue-500 mr-2" />
              <span>{currentSalesExecutive?.contact}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="text-green-500 mr-2" />
              <span>{currentSalesExecutive?.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DataTable
        data={customers} // Ensure data is an array
        columns={columns}
        filterColumn="route_name"
        title="Sales Executives"
      />
    </div>
  );
};

export default ViewSalesExecutive;

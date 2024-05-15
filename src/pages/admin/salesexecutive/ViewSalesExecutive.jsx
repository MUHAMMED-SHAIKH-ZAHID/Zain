import { FaMapMarkerAlt, FaMobileAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useSelector } from "react-redux";
import profile from '../../../assets/Profile/profile.jpeg'


const ViewSalesExecutive = () => {
  const { currentSalesExecutive } = useSelector((state) => state?.salesExecutives);

  return (
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
          <h2 className="text-2xl font-semibold">{currentSalesExecutive?.name}</h2>
          <p className="text-gray-600">{currentSalesExecutive?.company_name}</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <MdEmail className="text-red-500 mr-2" />
              <span>{currentSalesExecutive?.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaMobileAlt className="text-blue-500 mr-2" />
              <span>{currentSalesExecutive?.mobile}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="text-green-500 mr-2" />
              <span>{currentSalesExecutive?.address}</span>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default ViewSalesExecutive;

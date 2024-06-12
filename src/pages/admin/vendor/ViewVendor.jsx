import { IoLocation } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useSelector } from "react-redux";
import { FaMobileAlt } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import profile from '../../../assets/Profile/profile.jpeg'
import PurchaseByVendor from "./PurchaseByVendor";
import Cards from "../dashboard/Cards";
import { RiBillLine } from "react-icons/ri";
import { BiDollarCircle } from "react-icons/bi";
import { GiMoneyStack } from 'react-icons/gi'; // Icon for Total Amount


const ViewVendor = () => {
    const { currentsupplier, currentpurchase } = useSelector((state) => state?.supplier);
    console.log(currentsupplier,"Debugging curren supplier")
    return (
        <>
<div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
  <div className="md:w-1/3 bg-gray-200 p-4 flex flex-col items-center">
    <img
      className="border-8 border-white rounded-full transition-all duration-300 transform hover:scale-105"
      src={profile}
      alt="Profile face"
      width="150"
    />
    <p className="text-gray-600 text-lg font-medium ">{currentsupplier?.company_name}</p>
    <h1 className="  text-gray-800 mt-2"></h1>
    <div className="grid grid-cols-1 gap-2 text-gray-500">
  <div className="flex items-center">
    <span className="w-32 font-medium text-gray-600">Vendor Name:</span>
    <span className="ml-3">{`${currentsupplier?.suffix} ${currentsupplier?.first_name} ${currentsupplier?.last_name}`}</span>
  </div>
  <div className="flex items-center">
    <span className="w-32 font-medium text-gray-600">GST Number:</span>
    <span className="ml-3">{currentsupplier?.gst_number}</span>
  </div>
  <div className="flex items-center">
    <span className="w-32 font-medium text-gray-600">PAN Number:</span>
    <span className="ml-3">{currentsupplier?.pan_number}</span>
  </div>
</div>

  </div>
  <div className="md:w-2/3">
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Cards
        heading="Total Bills"
        amount={`${currentsupplier?.totalPurchaseCount}`}
        Icon={RiBillLine}
        bgImage="#E0F7FA"
        textColor="#006064"
      />
      <Cards
        heading="Total Bill Amount"
        amount={`₹${currentsupplier?.totalPurchaseAmount}`}
        Icon={GiMoneyStack}
        bgImage="#F3E5F5"
        textColor="#4A148C"
      />
      <Cards
        heading="Balance Amount"
        amount={`₹${currentsupplier?.totalBalanceAmount}`}
        Icon={GiMoneyStack}
        bgImage="#FFF3E0"
        textColor="#BF360C"
      />
    </div>
    <div className="px-8 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center text-gray-600">
          <MdEmail className="text-red-500" />
          <span className="ml-3">{currentsupplier?.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaMobileAlt className="text-blue-500" />
          <span className="ml-3">{currentsupplier?.contact_number}</span>
        </div>
        
      
      </div>
        <div className="flex  pt-4 text-gray-600">
          <FaMapLocationDot className="text-green-500" />
          <span className="ml-3">{currentsupplier?.address}</span>
        </div>
    </div>
  </div>
</div>

            <div className="mt-4">
                <PurchaseByVendor />
            </div>
        </>
    );
};

export default ViewVendor;

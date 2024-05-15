import { IoLocation } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useSelector } from "react-redux";
import PurchaseBySupplier from "./PurchaseBySupplier";
import { FaMobileAlt } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import profile from '../../../assets/Profile/profile.jpeg'

const ViewSupplier = () => {
    const { currentsupplier, currentpurchase } = useSelector((state) => state?.supplier);
       console.log(currentsupplier,"shahaikhhhhhhhhhh")
    return (
        <>
            <div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gray-200 p-2 flex flex-col items-center">
                    <img className="border-8 border-white rounded-full transition-all duration-300 transform hover:scale-105" src={profile} alt="Profile face" width="130" />
                    <h1 className="font-semibold text-lg text-gray-800 mt-2">{currentsupplier?.name}</h1>
                    <p className="text-gray-600">{currentsupplier?.company_name}</p>
                </div>
                <div className="md:w-2/3">
                    <div className="p-4 grid grid-cols-3 gap-4">
                        {/* Statistics Cards */}
                        <div className="bg-blue-500 text-white p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-600">
                            <p className="text-lg ">Total Purchases</p>
                            <p className="text-xl font-bold">{currentsupplier?.totalPurchaseCount}</p>
                        </div>
                        <div className="bg-green-500 text-white p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-green-600">
                            <p className="text-lg ">Total Amount</p>
                            <p className="text-xl font-bold text-white">{currentsupplier?.totalPurchaseAmount}</p>
                        </div>
                        <div className="bg-red-500 text-white p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-red-600">
                            <p className="text-lg ">Balance Amount</p>
                            <p className="text-xl font-bold">{currentsupplier?.totalBalanceAmount}</p>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-600">
                                <MdEmail className="text-red-500" />
                                <span className="ml-2">{currentsupplier?.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaMobileAlt className="text-blue-500" />
                                <span className="ml-2">{currentsupplier?.contact_one}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaMapLocationDot />
                                <span className="ml-2">{currentsupplier?.address_one}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <IoLocation />
                                <span className="ml-2">{currentsupplier?.location?.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <PurchaseBySupplier />
            </div>
        </>
    );
};

export default ViewSupplier;

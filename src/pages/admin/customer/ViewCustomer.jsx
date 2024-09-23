import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { MdEmail } from 'react-icons/md';
import { FaMobileAlt } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { RiBillLine } from 'react-icons/ri';
import { GiMoneyStack } from 'react-icons/gi';
import profile from '../../../assets/Profile/profile.jpeg';
import Cards from '../dashboard/Cards';
import CustomerSale from './CustomerSale';

const ViewCustomer = () => {
    const { currentCustomer,loading } = useSelector((state) => state?.customers);
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    if (loading) {
        return (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="text-md font-medium mb-4">Loading Customer profile...</div>
            <div className="border-8 border-gray-200 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        );
      }

    return (
        <>
            <div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gray-200 p-4 flex flex-col items-center">
                    <img
                        className="border-8 border-white rounded-full transition-transform duration-300 transform hover:scale-105"
                        src={profile}
                        alt="Profile face"
                        width="80"
                    />
                    <h1 className="text-gray-800 mt-1">{currentCustomer?.company_name}</h1>
                    <p className="text-gray-600 text-lg font-medium">{currentCustomer?.name}</p>
                    <div className="grid grid-cols-1 gap-2 text-gray-500 mt-1">
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-600">Customer Code:</span>
                            <span className="ml-3">{currentCustomer?.code}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-600">GST Number:</span>
                            <span className="ml-3">{currentCustomer?.gst}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-600">Channel:</span>
                            <span className="ml-3">{currentCustomer?.channel?.channel}</span>
                        </div>
                    </div>
                </div>
                <div className="md:w-2/3">
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Cards
                            heading="Total Sales"
                            amount={`${currentCustomer?.totalSalesCount}`}
                            Icon={RiBillLine}
                            bgImage="#E0F7FA"
                            textColor="#006064"
                        />
                        <Cards
                            heading="Total Sales Amount"
                            amount={`₹${currentCustomer?.totalSalesAmount}`}
                            Icon={GiMoneyStack}
                            bgImage="#F3E5F5"
                            textColor="#4A148C"
                        />
                        <Cards
                            heading="Balance Amount"
                            amount={`₹${currentCustomer?.totalBalanceAmount}`}
                            Icon={GiMoneyStack}
                            bgImage="#FFF3E0"
                            textColor="#BF360C"
                        />
                    </div>
                    <div className="px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-600">
                                <MdEmail className="text-red-500" />
                                <span className="ml-3">{currentCustomer?.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaMobileAlt className="text-blue-500" />
                                <span className="ml-3">{currentCustomer?.phone}</span>
                            </div>
                        </div>
                        {/* <div className="flex pt-4 text-gray-600">
                            <FaMapLocationDot className="text-green-500" />
                            <span className="ml-3">{currentCustomer?.address}</span>
                        </div> */}
                        <div  className="pt-4 text-gray-600 h-20 flex items-center gap-2">
                        <FaMapLocationDot className="text-green-500" />
                            <div className="max-h-32 w-full overflow-y-auto h-14 no-scrollbar  border border-gray-200 rounded-md p-2">
                                {currentCustomer?.shipping_addresses
                                    ?.slice(0, showMore ? currentCustomer.shipping_addresses.length : 1)
                                    .map((address, index) => (
                                        <p key={index} className="ml-4 mb-2">{address.address}</p>
                                    ))}
                            </div>
                            {currentCustomer?.shipping_addresses?.length > 1 && (
                                <button
                                    className="text-blue-500 text-[.6rem] underline mt-2"
                                    onClick={toggleShowMore}
                                >
                                    {showMore ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                        </div>
                        {/* <div className="pt-4 text-gray-600">
                            <a href={currentCustomer?.map_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                View Location on Map
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>
            <CustomerSale />
        </>
    );
};

export default ViewCustomer;

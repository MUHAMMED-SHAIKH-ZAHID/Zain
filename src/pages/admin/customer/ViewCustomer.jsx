import { FaMapLocationDot } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { FaMobileAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdEmail } from "react-icons/md";
import CustomerSale from "./CustomerSale";

const ViewCustomer = () => {
    const { currentCustomer} = useSelector((state) =>state?.customers);
    console.log(currentCustomer,"current suppleir debug in the ViewCustomer page",)
  return (
    <>
    <div
    className="border-2 ">
    <div className="rounded-t-lg h-32 overflow-hidden ">
        <img className="object-cover object-top w-full " src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain' />
    </div>
    <div className="grid  grid-cols-4">
    <div className="mx-5 w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img className="object-cover object-center h-32" src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Woman looking front'/>

    </div>
    <div className="grid gap-2 mt-3">       
     <p className="text-gray-500 flex gap-2 items-center   "><MdEmail className="text-red-400"/>{currentCustomer?.email}</p>
     <p className="text-gray-500 flex gap-2 items-center   "><FaMobileAlt className="text-blue-500" />{currentCustomer?.contact_1}</p>
</div>
<div className="grid gap-2 mt-3">       
<p className="text-gray-500 flex gap-2 items-center   "><FaMapLocationDot  />{currentCustomer?.address_1}</p>
<p className="text-gray-500 flex gap-2 items-center   "><IoLocation />{currentCustomer?.map_url}</p>

</div>
{/* <div className="grid gap-2 mt-3">       
<p className="text-gray-500 flex gap-2 items-center   "><span className="inline-flex items-center justify-center px-2 py-1 bg-green-500 text-white text-sm font-semibold rounded-full shadow">
  PAN
</span>
{currentCustomer?.pan_number}</p>
<p className="text-gray-500 flex gap-2 items-center   "><span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded">
  GST
</span>
{currentCustomer?.gst_number}</p>

</div> */}

    </div>
    <div className="text-start ml-4  mt-2 pb-4">
        <h2 className="font-semibold">{currentCustomer?.name}</h2>
        <p className="text-gray-500">{currentCustomer?.company_name}</p>
    </div>
    
        {/* <div className="p-4 border-t mx-8 mt-2">
            <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">Follow</button>
        </div> */}
</div>
<div className="">
    <CustomerSale />
</div>
</>
  );
};

export default ViewCustomer;


import { CiUser } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";

const DashboardDetailCard = ({customer,supplier}) => {
  return ( 
    <div className=' p-6 shadow-xl w-full text-white gap-2 rounded-xl flex items-center flex-col bg-[#1D224D]' >
      {/* <p className='text-xl font-semibold font-sans'>Overview</p> */}
      <div className='flex  gap-8'>
        <div className='mt-4'>
          < PiUsersThree className='text-[4rem] bg-[#9CA7FF] text-[#1D224D] rounded-full p-2 font-medium' />
        </div>
        <div className='items-center gap-2 pt-4'>
          <p className='text-lg text-[#9CA7FF] font-thin'>Total Customer</p>
          <p className='text-2xl '> {customer}</p>
        </div>
      </div>

      <div className='flex  gap-8 mt-10'>
        <div className='mt-4'>
        < CiUser className='text-[4rem] bg-[#9CA7FF] text-[#1D224D] rounded-full p-2 font-extrabold' />
        </div>
        <div className=' items-center gap-2 pt-4'>
          <p className='text-lg text-[#9CA7FF] font-thin'>Total Supplier</p>
          <p className='text-2xl '>{supplier}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardDetailCard;

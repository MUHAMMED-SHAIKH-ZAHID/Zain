
import { CiUser } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";

const DashboardDetailCard = ({customer,supplier}) => {
  return ( 
    <div className=' p-6 shadow-xl w-full text-white gap-2 rounded-xl flex items-center flex-col bg-[#1D224D]' >
      {/* <p className='text-xl font-semibold font-sans'>Overview</p> */}
      <div className='flex  gap-8'>
        <div className='mt-4'>
          < PiUsersThree className='md:text-[4rem] text-[2.5rem] bg-[#9CA7FF] text-[#1D224D] rounded-full p-2 font-medium' />
        </div>
        <div className='items-center gap-2 pt-4'>
          <p className='md:text-lg :text-sm text-[#9CA7FF] font-thin'>Total Customer</p>
          <p className='md:text-2xl text-md '> {customer}</p>
        </div>
      </div>
      {supplier &&
      <div className='flex  gap-8 mt-10'>
        <div className='mt-4'>
        < CiUser className='md:text-[4rem] text-[2.5rem] bg-[#9CA7FF] text-[#1D224D] rounded-full p-2 font-extrabold' />
        </div>
        <div className=' items-center gap-2 pt-4'>
          <p className='md:text-lg text-sm text-[#9CA7FF] font-thin'>Total Supplier</p>
          <p className='md:text-2xl text-md'>{supplier}</p>
        </div>
      </div>
      }
    </div>
  );
}

export default DashboardDetailCard;

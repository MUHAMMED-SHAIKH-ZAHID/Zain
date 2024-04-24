
import cardBg6 from "../../../../public/assets/dashbord/card17.jpg";
import { IoMdPeople } from 'react-icons/io';
import { IoPersonCircle } from 'react-icons/io5';

const DashboardDetailCard = ({customer,supplier}) => {
  return ( 
    <div className='px-4 py-8 shadow-xl w-[250px] text-white gap-2 rounded-xl flex items-center flex-col' style={{ backgroundImage: `url(${cardBg6})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <p className='text-xl font-semibold font-sans'>Overview</p>
      <div className='flex flex-col gap-2'>
        <div className='mt-4'>
          <p className='text-xl'>Total Customer</p>
        </div>
        <div className='flex items-center gap-4'>
          < IoMdPeople className='text-5xl font-extrabold' />
          <p className='text-2xl'> {customer}</p>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='mt-4'>
          <p className='text-xl'>Total Supplier</p>
        </div>
        <div className='flex items-center gap-4'>
          < IoPersonCircle className='text-5xl font-extrabold' />
          <p className='text-2xl'>{supplier}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardDetailCard;

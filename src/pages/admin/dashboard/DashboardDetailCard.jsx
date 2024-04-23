import React from 'react';
import { GoGraph } from "react-icons/go";
import { VscGraph } from "react-icons/vsc";
import cardBg6 from "../../../../public/assets/dashbord/card17.jpg";
import { BsGraphDownArrow } from "react-icons/bs";

const DashboardDetailCard = () => {
  return ( 
    <div className='px-4 py-8 shadow-xl w-[250px] text-white gap-2 rounded-xl flex items-center flex-col' style={{ backgroundImage: `url(${cardBg6})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <p className='text-xl font-semibold font-sans'>Heading For This</p>
      <div className='flex flex-col gap-2'>
        <div className='mt-4'>
          <p className='text-xl'>Total Incom</p>
        </div>
        <div className='flex items-center gap-4'>
          <GoGraph className='text-5xl font-extrabold' />
          <p className='text-2xl'> 23457</p>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='mt-4'>
          <p className='text-xl'>Total Expence</p>
        </div>
        <div className='flex items-center gap-4'>
          <BsGraphDownArrow className='text-5xl font-extrabold' />
          <p className='text-2xl'>23457</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardDetailCard;

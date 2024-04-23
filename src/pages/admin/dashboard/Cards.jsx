import React from 'react';
// import cardBg from '../asset2/cardBg1.jpeg';
import { FaBalanceScaleLeft } from "react-icons/fa";

const Cards = ({ heading, amount, subheading, Icon, bgImage }) => {
  return (
    <div className='w-[300px]  p-8 rounded-xl shadow-xl flex items-center justify-between text-white' style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center',  }}>
     <div className='flex flex-col gap-4'>
     <p className=' font-semibold'>{heading} </p>
     <p className='font-bold text-2xl'>+ {amount}</p>
     <p className='text-sm'>{subheading}</p>
     </div>
     {/* <div className='b-[#ecb06191] p-4 rounded-full border-4 border-purple-400'> */}
     <Icon className='text-5xl ' />
     {/* </div> */}
    </div>
  );
}

export default Cards;

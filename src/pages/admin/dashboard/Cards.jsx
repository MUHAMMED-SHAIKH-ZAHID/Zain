import React from 'react';
// import cardBg from '../asset2/cardBg1.jpeg';
import { FaBalanceScaleLeft } from "react-icons/fa";

const Cards = ({ heading, amount, subheading, Icon, bgImage ,textColor}) => {
  return (
    <div className={`  p-4 rounded-xl shadow-sm flex items-center justify-between text-black `} style={{ backgroundColor: bgImage , color :textColor,    border: `.5px solid ${textColor}`  }}>
     <div className='flex flex-col gap-4'>
     <p className=' font-thin'>{heading} </p>
     <p className='font-bold text-2xl flex'>₹ {amount}</p>
     <p className='text-sm'>{subheading}</p>
     </div>
     {/* <div className='b-[#ecb06191] p-4 rounded-full border-4 border-purple-400'> */}
     <Icon className='text-5xl ' /> 
     {/* </div> */}
    </div>
  );
}

export default Cards;

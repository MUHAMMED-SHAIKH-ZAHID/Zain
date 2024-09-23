

const ProfileCards = ({ heading, amount,  Icon, bgImage }) => {
  return (
    <div className='w-full py-2 p-8 rounded-xl shadow-xl flex items-center justify-between text-white' style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center',  }}>
     <div className='flex flex-col gap-2'>
     <p className=' font-semibold'>{heading} </p>
     <p className='font-bold text-xl'> $ {amount}</p>
    
     </div>
     {/* <div className='b-[#ecb06191] p-4 rounded-full border-4 border-purple-400'> */}
     <Icon className='text-4xl ' />
     {/* </div> */}
    </div>
  );
}

export default ProfileCards;

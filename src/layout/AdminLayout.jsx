import { Outlet } from 'react-router-dom';
import Navbar from '../components/commoncomponents/Navbar';
import Sidebar from '../components/commoncomponents/Sidebar';

const AdminLayout = () => {
  return (
    <div className=" h-screen bg-black  grid grid-cols-[auto,10fr]">
    <Sidebar className="  p-2" /> {/* Adjusted with padding and background */}
    <div className="flex flex-col h-screen">  
      <Navbar className="bg-white shadow-md " />
      <div className="flex-grow overflow-y-auto scrollbar-hidden  shadow-inner-black-25 bg-[#f8f9fa]  p-5  "> 
        <Outlet />
      </div>
    </div>
  </div>  )
}

export default AdminLayout
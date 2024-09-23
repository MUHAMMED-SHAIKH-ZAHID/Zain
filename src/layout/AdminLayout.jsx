import { Outlet } from 'react-router-dom';
import Navbar from '../components/commoncomponents/Navbar';
import Sidebar from '../components/commoncomponents/Sidebar';

const AdminLayout = () => {
  return (
    <div className="h-screen flex bg-black">
      <Sidebar className="transition-all duration-300" /> {/* Sidebar with transition for resizing */}
      <div className="flex flex-col flex-grow h-screen overflow-hidden">  {/* Main content area */}
        <Navbar className="bg-white shadow-md" />
        <div className="flex-grow overflow-y-auto bg-[#f8f9fa] p-2"> {/* Main content wrapper */}
          <div className="overflow-x-auto h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

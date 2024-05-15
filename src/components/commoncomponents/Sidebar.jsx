import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdAccountBalance, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaUsers, FaUserCircle } from "react-icons/fa";
import { BsPersonBoundingBox, BsDatabaseFillUp } from "react-icons/bs";
import { BiSolidPurchaseTag, BiSolidReport } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { GoDotFill } from "react-icons/go";

const SidebarData = [
  { name: "Dashboard", icon: MdDashboard, path: "/" },
  { name: "Supplier", icon: FaUsers, path: "/supplier" },
  {
    name: "Purchase",
    icon: BiSolidPurchaseTag,
    path: "/purchase",
    submenu: [
      { name: "Purchase List", path: "/purchase/" },
      { name: "Purchase Quotation", path: "/purchase/quotation" }
    ],
    arrow: true
  },
  { name: "Sales Executive", icon: FaUserCircle, path: "/salesexecutive" },
  { name: "Customer", icon: BsPersonBoundingBox, path: "/customer" },
  {
    name: "Sales",
    icon: FaUsers,
    path: "/sales",
    submenu: [
      { name: "Sales List", path: "/sales/" },
      { name: "Sales Quotation", path: "/sales/quotation" }
    ],
    arrow: true
  },
  { name: "Accounts", icon: MdAccountBalance, path: "/account" },
  { name: "Data Manage", icon: BsDatabaseFillUp, path: "/datamanage" },
  { name: "Stock", icon: MdOutlineProductionQuantityLimits, path: "/stock" },
  { name: "Reports", icon: BiSolidReport, path: "/reports" }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current path matches exactly with the menu item's path
  const isActive = (path) => location.pathname === path;

  const toggleSubMenu = (name) => {
    setSubMenuOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`h-screen transition-all duration-300 ${isOpen ? 'w-52' : 'w-20'} bg-gray-900`}>
      <div className="flex flex-col mx-4 h-full backdrop-blur-lg shadow-md">
        <div className="flex items-center pt-6 p-4">
          <div className="relative w-8 h-8 mr-2">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="relative flex items-center p-3 justify-center h-full text-white font-bold text-xl">
              ZS
            </div>
          </div>
          {isOpen && <h1 className="text-lg font-normal text-gray-200">Zain Sales</h1>}
        </div>
        {isOpen &&   <div className="text-[.6rem] text-center mb-3 text-gray-400 ">Sales Managment Dashboard</div>}
          <button onClick={toggleSidebar} className="ml-auto text-gray-400 hover:text-white flex items-center">
            <IoIosArrowBack className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} /> {isOpen &&  <span className="text-[.6rem]">Minimize</span>}
          </button>
        <div className="flex-grow mt-8">
          {SidebarData.map((data, i) => {
            const Icon = data.icon;
            const itemColor = isActive(data.path) ? "bg-white bg-opacity-20 text-white" : "text-gray-400 hover:text-white";
            
            return (
              <div key={i} className={`w-full px-2 py-1 mb-2 rounded-md transition duration-300 ease-in-out ${itemColor}`}>
                <div onClick={() => {
                  if (data.submenu) toggleSubMenu(data.name);
                  else navigate(data.path);
                }} className="flex justify-between items-center cursor-pointer font-medium">
                  <div className="flex gap-3 text-[.9rem] font-normal py-1 items-center">
                    <Icon className="w-5 h-5" />
                    {isOpen && <div>{data.name}</div>}
                  </div>
                  {data.arrow && isOpen && (
                    <IoIosArrowForward className={`transition-transform duration-300 ${subMenuOpen[data.name] ? 'rotate-90' : 'rotate-0'}`} />
                  )}
                </div>
                {data.submenu && (
                  <div className={`overflow-hidden transition-all duration-700 ease-in-out ${subMenuOpen[data.name] ? 'max-h-40' : 'max-h-0'}`}>
                    {data.submenu.map((sub, index) => (
                      <div key={index} onClick={() => navigate(sub.path)} className={`pl-4 flex gap-3 mt-2 items-center cursor-pointer rounded-md text-[.8rem] font-normal text-gray-400 hover:text-gray-300 ${isActive(sub.path) ? 'bg-white bg-opacity-20 text-white py-1' : ''}`}>
                        <div className="flex items-center gap-1">
                          <GoDotFill className="text-gray-600 w-3" />
                          {isOpen &&  sub.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center  w-full text-center items-center">
          <div onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="flex cursor-pointer flex-start gap-3 mb-2 text-gray-400 font-medium text-center items-center">
            <RiLogoutBoxRFill className="h-5 w-5" />
            {isOpen && <div>Logout</div>}
          </div>
        </div>
        {isOpen &&   <div className="text-[.5rem] text-center mb-3 text-gray-400 ">Developed by Grohance</div>}

      </div>
    </div>
  );
};

export default Sidebar;

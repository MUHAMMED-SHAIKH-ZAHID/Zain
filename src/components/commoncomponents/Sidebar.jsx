import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdAccountBalance, MdOutlineProductionQuantityLimits, MdOutlinePayment, MdAccountBalanceWallet } from "react-icons/md";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaUsers, FaUserCircle, FaFileInvoice } from "react-icons/fa";
import { BsPersonBoundingBox, BsDatabaseFillUp, BsBlockquoteRight } from "react-icons/bs";
import { BiSolidPurchaseTag, BiSolidReport } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { SiExpensify } from "react-icons/si";

const SidebarData = [
  { name: "Dashboard", icon: MdDashboard, path: "/" },
  {
    name: "Purchase",
    icon: BiSolidPurchaseTag,
    path: "/purchase",
    submenu: [
      { name: "Vendor", icon: FaUsers, path: "/vendor" },
      { name: "Purchase Order", icon: BsBlockquoteRight, path: "/purchase/order" },
      { name: "Purchase Bill", icon: FaFileInvoice, path: "/purchase/" },
      { name: "DebitNote/Purchase Return", icon: MdOutlinePayment, path: "/debitnote/" },
    ],
    arrow: true
  },
  { name: "Sales Executive", icon: FaUserCircle, path: "/salesexecutive" },
  { name: "Products", icon: MdOutlineProductionQuantityLimits, path: "/products" },
  { name: "Expense", icon: SiExpensify, path: "/expense/" },
  { name: "Payment", icon: MdOutlinePayment, path: "/payment/" },
  {
    name: "Sales",
    icon: FaUsers,
    path: "/sales",
    submenu: [
      { name: "Customer", icon: BsPersonBoundingBox, path: "/customer" },
      { name: "Sales Order", icon: BsBlockquoteRight, path: "/sales/order" },
      { name: "Invoice", icon: FaFileInvoice, path: "/invoice/" },
      { name: "Credit Note/Invoice Return", icon: FaFileInvoice, path: "/creditnote/" },
    ],
    arrow: true
  },
  {
    name: 'Accounts',
    icon: MdAccountBalance,
    path: '/accounts',
    submenu: [
       { name: 'Accounts Manage',
        icon: MdAccountBalanceWallet,
        path: '/account',},
      { name: 'Customer Ledger', icon: BsPersonBoundingBox, path: '/customerledger' },
      { name: 'Supplier Ledger', icon: BsBlockquoteRight, path: '/supplierledger' },
      { name: 'InputTax Ledger', icon: BsBlockquoteRight, path: '/inputtaxledger' },
      { name: 'OutputTax Ledger', icon: BsBlockquoteRight, path: '/outputtaxledger' },
      { name: 'Sales Ledger', icon: FaFileInvoice, path: '/salesledger' },
      { name: 'Purchase Ledger', icon: FaFileInvoice, path: '/purchaseledger' },
    ],
    arrow: true,
  },
  { name: "Data Manage", icon: BsDatabaseFillUp, path: "/datamanage" },
  { name: "Stock", icon: MdOutlineProductionQuantityLimits, path: "/stock" },
  // { name: "Reports", icon: BiSolidReport, path: "/reports" }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

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
       
          {isOpen && <h1 className="text-lg font-normal text-gray-200">Gnidertron Private Limited</h1>}
        </div>
        {isOpen && <div className="text-[.6rem] text-center mb-3 text-gray-400">Sales Management Dashboard</div>}
        <button onClick={toggleSidebar} className="ml-auto text-gray-400 hover:text-white flex items-center">
          <IoIosArrowBack className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} /> {isOpen && <span className="text-[.6rem]">Minimize</span>}
        </button>
        <div className="flex-grow mt-8 overflow-y-auto no-scrollbar">
          {SidebarData.map((data, i) => {
            const Icon = data.icon;
            const itemColor = isActive(data.path) ? "bg-white bg-opacity-20 text-white " : "text-gray-400 hover:text-white";
            
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
                  <div className={`overflow-hidden transition-all duration-700 ease-in-out ${subMenuOpen[data.name] ? 'max-h-96' : 'max-h-0'}`}>
                    {data.submenu.map((sub, index) => {
                      const SubIcon = sub.icon;
                      return (
                        <div key={index} onClick={() => navigate(sub.path)} className={`pl-4 flex gap-3 mt-3 items-center cursor-pointer rounded-md text-[.8rem] font-normal text-gray-400 hover:text-gray-300 ${isActive(sub.path) ? 'bg-white bg-opacity-20 text-white py-1' : ''}`}>
                          <SubIcon className="w-4 h-4" />
                          {isOpen && sub.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex px-3 pt-10 w-full text-center items-center">
          <div onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="flex cursor-pointer flex-start gap-3 mb-2 text-gray-400 hover:text-red-300 font-medium text-center items-center">
            <RiLogoutBoxRFill className="h-5 w-5" />
            {isOpen && <div>Logout</div>}
          </div>
        </div>
        {isOpen && <div className="text-[.5rem] px-4 mb-3 text-gray-400">Developed by Grohance</div>}
      </div>
    </div>
  );
};

export default Sidebar;

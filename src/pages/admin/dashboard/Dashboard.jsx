import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../../../redux/features/DashboardSlice';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import { useEffect } from 'react';
import Cards from './Cards';
import DashboardChart from './DashboardChart';
import DashboardDetailCard from './DashboardDetailCard';
import { LiaCoinsSolid } from "react-icons/lia";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { HiShoppingBag } from "react-icons/hi";
import { BsGraphDownArrow } from 'react-icons/bs';
import RecentInvoices from './RecentInvoices';
import bgone from '../../../assets/bgImages/lightblue.jpeg'
import bgtwo from '../../../assets/bgImages/beige.jpeg'
import bgthree from '../../../assets/bgImages/green.jpeg'
import { PiArrowDownLeft } from 'react-icons/pi';
import { HiArrowsRightLeft } from 'react-icons/hi2';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state?.dashboard || {});

  useEffect(() => {
    dispatch(setHeading("Welcome Back , Admin 👋"));
    dispatch(fetchDashboardData());
    return () => dispatch(clearHeading());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <div className="text-lg font-semibold mb-4">Loading dashboard data...</div>
        <div className="border-8 border-gray-200 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
   }

  return (
    <div className="grid gap-8 p-3 pt-3">
      <div className="grid  grid-cols-[2fr,6fr] gap-4">
    <div className="flex flex-row gap-8">
      <DashboardDetailCard customer={data?.customers} supplier={data?.suppliers} />
      </div>
      <div>
      <div className="flex gap-8">
        <div className="flex w-full flex-col gap-8">
          
          <Cards
            heading="Today income"
            amount={parseInt(data?.todayIncome).toFixed(2)}
            subheading=""
            Icon={PiArrowDownLeft} // Pass the icon component reference
            bgImage='#DDFFD8' // Provide the background image URL
            textColor='#3A6211'
          />
          <Cards
            heading="Today Expence"
            amount={parseInt(data?.todayExpense).toFixed(2)}
            subheading=""
            Icon={BsGraphDownArrow} // Pass the icon component reference
            bgImage='#EFE1E1' // Provide the background image URL
            textColor='#BE2F2F'
          />
        </div>
        <div className=" w-full flex flex-col gap-8">
          <Cards
            heading="This Month Income"
            amount={parseInt(data?.thisMonthIncome).toFixed(2)}
            subheading=""
            Icon={PiArrowDownLeft} // Pass the icon component reference
            bgImage='#DDFFD8' // Provide the background image URL
            textColor='#3A6211'
          />
          <Cards
            heading="This Month Expense"
            amount={parseInt(data?.thisMonthExpense).toFixed(2)}
            subheading=""
            Icon={LiaCoinsSolid} // Pass the icon component reference
            bgImage="#EFE1E1" // Provide the background image URL
            textColor='#BE2F2F'
          />
        </div>
        <div className="flex w-full flex-col gap-8">
          <Cards
            heading="Today Revenue"
            amount={parseInt(data?.todayRevenue).toFixed(2)}
            subheading=""
            Icon={HiArrowsRightLeft} // Pass the icon component reference
            bgImage='#D8E1FF' // Provide the background image URL
            textColor='#1564AD'
          />
          <Cards
            heading="This Months Revenue"
            amount={parseInt(data?.thisMonthRevenue).toFixed(2)}
            subheading=""
            Icon={HiArrowsRightLeft} // Pass the icon component reference
            bgImage='#D8E1FF' // Provide the background image URL
            textColor='#1564AD'

          />
          
        </div>
      </div>
    </div>
</div>
    <div>
<DashboardChart/>
    </div>
    <div className="">
      <RecentInvoices invoices={data?.invoices} />
    </div>
  </div>
  );
};

export default Dashboard;

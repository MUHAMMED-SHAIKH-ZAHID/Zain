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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state?.dashboard || {});

  useEffect(() => {
    dispatch(setHeading("Dashboard"));
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
    <div className="flex flex-col gap-8 ">
    <div className="flex flex-row gap-8">
      <DashboardDetailCard customer={data?.customers} supplier={data?.suppliers} />
      <div className="flex gap-8">
        <div className="flex flex-col gap-8">
          <Cards
            heading="Today income"
            amount={data?.todayIncome}
            subheading="Subheading 1"
            Icon={GoGraph} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
          <Cards
            heading="Today Expence"
            amount={data?.todayExpense}
            subheading="Subheading 1"
            Icon={BsGraphDownArrow} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
        </div>
        <div className="flex flex-col gap-8">
          <Cards
            heading="This Month Income"
            amount={data?.thisMonthIncome}
            subheading="Subheading 1"
            Icon={HiShoppingBag} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
          <Cards
            heading="This Month Revenue"
            amount={data?.thisMonthExpense}
            subheading="Subheading 1"
            Icon={LiaCoinsSolid} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
        </div>
        <div className="flex flex-col gap-8">
          <Cards
            heading="Today Revenue"
            amount={data?.todayRevenue}
            subheading="Subheading 1"
            Icon={FaRegMoneyBillAlt} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
          <Cards
            heading="This Months Revenue"
            amount={data?.thisMonthRevenue}
            subheading="Subheading 1"
            Icon={GoGraph} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
          
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

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import { fetchDashboardData } from '../../../redux/features/salesExecutive/ExecutiveDashboardSlice';
import Cards from '../../admin/dashboard/Cards';
import { PiAirplaneInFlightDuotone, PiArrowDownLeft, PiArrowUpLeft, PiArrowUpRight } from 'react-icons/pi';
import DashboardDetailCard from '../../admin/dashboard/DashboardDetailCard';
import { HiArrowsRightLeft } from 'react-icons/hi2';
import CustomLineChart from './CustomLineChart'; // Adjust the import path as needed
import RecentInvoices from '../../admin/dashboard/RecentInvoices';
import { GrDocumentPerformance } from "react-icons/gr";
import { GiMoneyStack } from 'react-icons/gi';

const ExecutiveDashboard = () => {
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setHeading(`Welcome Back , ${currentuser ? currentuser : "Admin"} 👋`));
    dispatch(fetchDashboardData());
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const { data, loading, error } = useSelector((state) => state?.executivedashboard || {});
console.log(data,"dyah")

  return (
    <div className="p-4">
       <div className="grid ">

      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8 mt-2 md:mt-8">
      <DashboardDetailCard customer={data?.customers} />
      
        <Cards
          heading="Today's Income"
          amount={parseFloat(data?.todayIncome).toFixed(2)}
          subheading=""
          Icon={PiArrowUpRight}
          bgImage="#DDFFD8"
          textColor="#3A6211"
        />
          <Cards
            heading="This Month's Income"
            amount={parseFloat(data?.thisMonthIncome).toFixed(2)}
            subheading=""
            Icon={PiArrowUpRight}
            bgImage="#DDFFD8"
            textColor="#3A6211"
          />
        <Cards
          heading="Sale Orders"
          amount={parseFloat(data?.todayIncome).toFixed(2)}
          subheading=""
          Icon={GrDocumentPerformance}
          bgImage="#DEDFD8"
          textColor="#3A3211"
        />
        <Cards
          heading="Total Payment"
          amount={data?.totalPayments}
          subheading=""
          Icon={GiMoneyStack}
          bgImage="#D8E1FF"
          textColor="#1564AD"
        />
        <Cards
          heading="Approved Payment"
          amount={data?.approvedPayments}
          subheading=""
          Icon={GiMoneyStack}
          bgImage="#D8E1FF"
          textColor="#1564AD"
        />
      </div>
       </div>
        {data?.monthlyIncomeData?.length != 0 && 
        
        <div className="mt-8">
          <CustomLineChart data={data?.monthlyIncomeData} />
        </div>
        }
        <div className="mt-5">
      <RecentInvoices invoices={data?.invoices} executive={true}/>
    </div>
    </div>
  );
};

export default ExecutiveDashboard;

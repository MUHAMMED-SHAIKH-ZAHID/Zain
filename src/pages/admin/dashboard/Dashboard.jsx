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
import { IoMdPeople } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { HiShoppingBag } from "react-icons/hi";

const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHeading("Dashboard"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Dispatch the action to fetch dashboard data when the component mounts
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }





  return (
    <div className="flex flex-col gap-8 ">
    <div className="flex flex-row gap-8">
      <DashboardDetailCard />
      <div className="flex gap-8">
        <div className="flex flex-col gap-8">
          <Cards
            heading="Total Suplier"
            amount="1000"
            subheading="Subheading 1"
            Icon={IoMdPeople} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
          <Cards
            heading="Total Customer"
            amount="1000"
            subheading="Subheading 1"
            Icon={IoPersonCircle} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
        </div>
        <div className="flex flex-col gap-8">
          <Cards
            heading="Total User"
            amount="1240"
            subheading="Subheading 1"
            Icon={HiShoppingBag} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
          <Cards
            heading="Heading 1"
            amount="4562"
            subheading="Subheading 1"
            Icon={LiaCoinsSolid} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
        </div>
        <div className="flex flex-col gap-8">
          <Cards
            heading="Heading 1"
            amount="2390"
            subheading="Subheading 1"
            Icon={FaRegMoneyBillAlt} // Pass the icon component reference
            bgImage={'../../../../public/assets/dashbord/cardBg12.jpg'} // Provide the background image URL
          />
          <Cards
            heading="Heading 1"
            amount="9636"
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
  </div>
  );
};

export default Dashboard;

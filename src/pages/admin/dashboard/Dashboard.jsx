import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom"
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Dashboard"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);
  return (
    <div>
      
      <Outlet context={{ heading: 'Dashboard' }} />
Dashboard

    </div>
  )
}

export default Dashboard
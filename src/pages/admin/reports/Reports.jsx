import { useEffect } from "react";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { useDispatch } from "react-redux";

const Reports = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setHeading("Reports"));
  
    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);
  return (
    <div>Reports</div>
  )
}

export default Reports
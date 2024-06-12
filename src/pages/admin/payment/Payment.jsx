import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { expenseColumn } from "../../../components/table/columns/ExpenseColumn";
import { fetchAllPayments } from "../../../redux/features/PaymentSlice";
import DataTable from "../../../components/table/DataTable";
import { paymentColumns } from "../../../components/table/columns/PaymentColumns";

const Payment = () => {
    const dispatch = useDispatch();
    const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState(null);
const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

    useEffect(() => {
      dispatch(setHeading("Payment"));
  
      // Optionally reset the heading when the component unmounts
      return () => {
        dispatch(clearHeading());
      };
    }, [dispatch]);
    useEffect(() => {
        // Dispatch the action to fetch dashboard data when the component mounts
        dispatch(fetchAllPayments());
      }, [dispatch]);
      const { payments, loading, error } = useSelector((state) => state?.payments);
      
      const editClickHandler = (rowData) => {
        console.log("Button clicked for row:", rowData);
        setEditData(rowData);
        setShowEditModal(true); // Open the modal when edit is clicked
      };
      const columns = paymentColumns(editClickHandler);
console.log(payments,"teh expenses page")

  return (
    <div>
           <DataTable
        data={payments}
        columns={columns}
        filterColumn="reference_type"
        title={'Payment'}
      />
              {/* {showEditModal && (
                <EditExpense
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    data={editData}
                />
            )} */}
    </div>
  )
}

export default Payment
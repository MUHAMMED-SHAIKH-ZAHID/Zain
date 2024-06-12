import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../../redux/features/HeadingSlice";
import { useEffect, useState } from "react";
import { fetchAllExpenses } from "../../../../redux/features/ExpenseSlice";
import DataTable from "../../../../components/table/DataTable";
import { suplierColumns } from "../../../../components/table/columns/SupplierColumns";
import { expenseColumn } from "../../../../components/table/columns/ExpenseColumn";
import EditExpense from "./EditExpense";

const Expense = () => {
    const dispatch = useDispatch();
    const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState(null);
const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

    useEffect(() => {
      dispatch(setHeading("Expense"));
  
      // Optionally reset the heading when the component unmounts
      return () => {
        dispatch(clearHeading());
      };
    }, [dispatch]);
    useEffect(() => {
        // Dispatch the action to fetch dashboard data when the component mounts
        dispatch(fetchAllExpenses());
      }, [dispatch]);
      const { expenses, loading, error } = useSelector((state) => state?.expense);
      
      const editClickHandler = (rowData) => {
        console.log("Button clicked for row:", rowData);
        setEditData(rowData);
        setShowEditModal(true); // Open the modal when edit is clicked
      };
      const columns = expenseColumn(editClickHandler);
console.log(expenses,"teh expenses page")

  return (
    <div>
           <DataTable
        data={expenses}
        columns={columns}
        filterColumn="payment_method"
        title={'Expense'}
      />
              {showEditModal && (
                <EditExpense
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    data={editData}
                />
            )}
    </div>
  )
}

export default Expense
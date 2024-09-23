import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../../redux/features/HeadingSlice";
import { useEffect, useState } from "react";
import { fetchAllExpenses } from "../../../../redux/features/ExpenseSlice";
import DataTable from "../../../../components/table/DataTable";
import { suplierColumns } from "../../../../components/table/columns/SupplierColumns";
import { expenseColumn } from "../../../../components/table/columns/ExpenseColumn";
import EditExpense from "./EditExpense";
import ViewExpense from "./ViewExpense";

const Expense = () => {
    const dispatch = useDispatch();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
const [editData, setEditData] = useState(null);
const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
const handleCloseViewModal = () => {
    setShowViewModal(false);
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
        setEditData(rowData);
        setShowEditModal(true); 
      };
      const viewClickHandler = (rowData) => {
        setEditData(rowData);
        setShowViewModal(true); 
      };
      const columns = expenseColumn(viewClickHandler,editClickHandler);

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
              {showViewModal && (
                <ViewExpense
                    show={showViewModal}
                    handleClose={handleCloseViewModal}
                    data={editData}
                />
            )}
    </div>
  )
}

export default Expense
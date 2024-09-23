import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { expenseColumn } from "../../../components/table/columns/ExpenseColumn";
import { fetchAllPayments } from "../../../redux/features/PaymentSlice";
import DataTable from "../../../components/table/DataTable";
import { paymentColumns } from "../../../components/table/columns/PaymentColumns";
import ViewPayment from "./ViewPayment";
import ApprovePayment from "./ApprovePayment";

const Payment = () => {
  const dispatch = useDispatch();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
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
      
  
      const viewClickHandler = (rowData) => {
        setEditData(rowData);
        setShowViewModal(true); 
      };

      const ClickHandler = (rowData) => {
        setEditData(rowData);
        setShowApproveModal(true);
      };
      const columns = paymentColumns(viewClickHandler,ClickHandler);

  return (
    <div>
           <DataTable
        data={payments}
        columns={columns}
        filterColumn="status"
        title={'Payment'}
      />
           {showViewModal && (
                <ViewPayment
                    show={showViewModal}
                    handleClose={handleCloseViewModal}
                    data={editData}
                />
            )}
                {showApproveModal && (
        <ApprovePayment
          show={showApproveModal}
          handleClose={handleCloseApproveModal}
          data={editData}
        />
      )}
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
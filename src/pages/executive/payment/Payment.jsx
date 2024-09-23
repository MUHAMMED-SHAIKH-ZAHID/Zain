import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { expenseColumn } from "../../../components/table/columns/ExpenseColumn";
import DataTable from "../../../components/table/DataTable";
import { paymentColumns } from "../../../components/table/columns/PaymentColumns";
import ViewPayment from "./ViewPayment";
import { fetchAllPayments } from "../../../redux/features/salesExecutive/ExecutivePaymentSlice";
import ApprovePayment from "../../admin/payment/ApprovePayment";

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

    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  const { payments, loading, error } = useSelector((state) => state?.executivepayments);

  const viewClickHandler = (rowData) => {
    setEditData(rowData);
    setShowViewModal(true);
  };

  const ClickHandler = (rowData) => {
    setEditData(rowData);
    setShowApproveModal(true);
  };
  const handleApprovePayment = (rowData) => {
    // Your logic for approving payment
  };

  const columns = paymentColumns(viewClickHandler, handleApprovePayment);


  return (
    <div>
      <DataTable
        data={payments}
        columns={columns}
        filterColumn="reference_type"
        title="Payments"
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
    </div>
  );
};

export default Payment;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { suplierColumns } from "../../../components/table/columns/SupplierColumns";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import DataTable from "../../../components/table/DataTable";
import { AccountBookColumns } from "../../../components/table/columns/AccountBookColumn";
import { FaMoneyBillAlt, FaUserAlt } from "react-icons/fa";

const AccountBook = () => {
  const columns = AccountBookColumns();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Account"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const { currentAccount, loading, error } = useSelector((state) => state?.account);
  console.log(currentAccount, "Account details");

  if (loading) {
    return <div>Loading...</div>; // Optionally, show a loading spinner or message
  }

  if (error) {
    return <div>Error fetching data: {error}</div>; // Display error message if any
  }

  // Conditionally rendering the DataTable only when currentAccount is not empty
  return (
    <div>
                 <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                    <FaUserAlt className="text-blue-500 mr-2 w-32 h-32" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Account Details</h3>
                        <p><strong>Account Name:</strong> {currentAccount?.account_name}</p>
                        <p><strong>ID:</strong> {currentAccount?.id}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <FaMoneyBillAlt className="text-green-500 mr-2 w-6 h-6" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Financial Info</h3>
                        <p><strong>Opening Balance:</strong> ${currentAccount?.opening_balance}</p>
                        <p><strong>Created At:</strong> {new Date(currentAccount?.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>

        <DataTable
          data={currentAccount?.payments}
          columns={columns}
          filterColumn="reference_type"
          title={'Supplier'}
        />

    </div>
  );
}

export default AccountBook;

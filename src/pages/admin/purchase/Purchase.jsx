import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import DataTable from "../../../components/table/DataTable";
import { PurchaseColumns } from "../../../components/table/columns/PurchaseColumns";
import DeletePurchase from "./DeletePurchase";
import { fetchAllPurchases } from "../../../redux/features/PurchaseSlice";

const Purchase = () => {
  const dispatch = useDispatch();
  const { purchases, loading, error } = useSelector((state) => state?.purchases);
 console.log(purchases,"purchase page debug")
  useEffect(() => {
    dispatch(fetchAllPurchases());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setHeading("Purchase"));
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const deleteClickHandler = (rowData) => {
    setDeleteItemId(rowData.id);
    setShowDeleteModal(true);
  };

  const handleDelete = (id) => {
    console.log("Deleting item with id:", id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const columns = PurchaseColumns(deleteClickHandler);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {purchases.length > 0 ? (
        <DataTable
          data={purchases}
          columns={columns}
          filterColumn="supplier_name"
          title={'Purchase'}
        />
      ) : (
        <div>No purchases available.</div>
      )}
      {showDeleteModal && (
        <DeletePurchase
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDelete}
          itemId={deleteItemId}
        />
      )}
    </div>
  );
};

export default Purchase;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { SalesExecutiveColumns } from "../../../components/table/columns/SalesExecutiveColumns";
import DataTable from "../../../components/table/DataTable";
import DeleteSalesExecutive from "./DeleteSalesExecutive";
import { fetchAllSalesExecutives, deleteSalesExecutive } from "../../../redux/features/SalesExecutiveSlice";
import EditSalesExecutive from "./EditSalesExecutive";

const SalesExecutive = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Sales Executive"));
    dispatch(fetchAllSalesExecutives()); // Fetch data on component mount
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const { salesExecutives, loading, error } = useSelector(state => state?.salesExecutives?.salesExecutives);
  console.log(salesExecutives)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const editClickHandler = (rowData) => {
    setEditData(rowData);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const deleteClickHandler = (rowData) => {
    setDeleteItemId(rowData.id);
    setShowDeleteModal(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteSalesExecutive(id));
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const columns = SalesExecutiveColumns(editClickHandler, deleteClickHandler);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <DataTable
          data={salesExecutives || []} // Ensure data is an array
          columns={columns}
          filterColumn="name"
          title="Sales Executive"
        />
      )}
      {showEditModal && (
        <EditSalesExecutive
          show={showEditModal}
          handleClose={handleCloseEditModal}
          data={editData}
        />
      )}
      <DeleteSalesExecutive
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDelete}
        itemId={deleteItemId}
      />
    </div>
  );
};

export default SalesExecutive;

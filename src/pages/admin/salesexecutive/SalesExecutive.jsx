import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { SalesExecutiveColumns } from "../../../components/table/columns/SalesExecutiveColumns";
import DataTable from "../../../components/table/DataTable";
import DeleteSalesExecutive from "./DeleteSalesExecutive";

const Data = Array.from({ length: 20 }, (_, index) => ({
    name: `Seller Name ${index + 1}`,
    email: `seller${index + 1}@example.com`,
    mobile: `123456789${index % 10}`, // Simple pattern for demonstration
    role: `Role ${index % 4 === 0 ? 'Admin' : 'User'}`, // Alternates between Admin and User
  }));

const SalesExecutive = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("SalesExecutive"));
    
    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  //   const [showEditModal, setShowEditModal] = useState(false);
// const [editData, setEditData] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteItemId, setDeleteItemId] = useState(null);


const editClickHandler = (rowData) => {
// console.log("Button clicked for row:", rowData);
// setEditData(rowData);
// setShowEditModal(true); // Open the modal when edit is clicked
};
const handleCloseEditModal = () => {
// setShowEditModal(false);
};

const deleteClickHandler = (rowData) => {
setDeleteItemId(rowData.id); // Assuming `id` is the unique identifier
setShowDeleteModal(true);
};

const handleDelete = (id) => {
console.log("Deleting item with id:", id);
// Perform your delete operation here
};

const handleCloseDeleteModal = () => {
setShowDeleteModal(false);
};
const columns = SalesExecutiveColumns(editClickHandler,deleteClickHandler);
  return (
    <div>
          <DataTable
        data={Data}
        columns={columns}
        filterColumn="role"
        title={'Sales Executive'}
      />
        <DeleteSalesExecutive
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDelete}
        itemId={deleteItemId}
      />
    </div>
  )
}

export default SalesExecutive
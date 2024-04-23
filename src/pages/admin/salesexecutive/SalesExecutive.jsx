import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { SalesExecutiveColumns } from "../../../components/table/columns/SalesExecutiveColumns";
import DataTable from "../../../components/table/DataTable";
import DeleteSalesExecutive from "./DeleteSalesExecutive";
import { deleteSalesExecutive, fetchAllSalesExecutives } from "../../../redux/features/SalesExecutiveSlice";
import EditSalesExecutive from "./EditSalesExecutive";



const SalesExecutive = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("SalesExecutive"));
    
    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);
  const { salesExecutives, loading, error } = useSelector((state) => state?.salesExecutives?.salesExecutives);

  useEffect(() => {
    dispatch(fetchAllSalesExecutives());
  }, [dispatch]);
  console.log(salesExecutives,"sales executive data from the backend")

    const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteItemId, setDeleteItemId] = useState(null);


const editClickHandler = (rowData) => {
console.log("Button clicked for row:", rowData);
setEditData(rowData);
setShowEditModal(true); // Open the modal when edit is clicked
};
const handleCloseEditModal = () => {
setShowEditModal(false);
};

const deleteClickHandler = (rowData) => {
setDeleteItemId(rowData.id); // Assuming `id` is the unique identifier
setShowDeleteModal(true);
};

const handleDelete = (id) => {
console.log("Deleting item with id:", id);
dispatch(deleteSalesExecutive(id))
};

const handleCloseDeleteModal = () => {
setShowDeleteModal(false);
};
const columns = SalesExecutiveColumns(editClickHandler,deleteClickHandler);
  return (
    <div>
          <DataTable
        data={salesExecutives}
        columns={columns}
        filterColumn="name"
        title={'Sales Executive'}
      />
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
  )
}

export default SalesExecutive
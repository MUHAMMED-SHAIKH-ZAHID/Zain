import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import DataTable from "../../../components/table/DataTable";
import { suplierColumns } from "../../../components/table/columns/SupplierColumns";
import { deleteSupplier, fetchAllSuppliers, fetchSupplierById } from "../../../redux/features/SupplierSlice";
import { Navigate, useNavigate } from "react-router-dom";
import EditVendor from "./EditVendor";
import DeleteVendor from "./DeleteVendor";



const Vendors = () => {
const navigate = useNavigate()

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
  dispatch(deleteSupplier(id))
};

const handleCloseDeleteModal = () => {
  setShowDeleteModal(false);
  
};
const viewClickHandler = (id) => {
  console.log(id.id,"checkign view data before trnasfre")
  dispatch(fetchSupplierById(id.id))
  navigate('/vendor/view')
}
  const columns = suplierColumns(viewClickHandler,editClickHandler);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Vendor Details"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const { suppliers, loading , error } = useSelector((state) => state?.supplier);

    useEffect(() => {
    // Dispatch the action to fetch dashboard data when the component mounts
    dispatch(fetchAllSuppliers());
  }, [dispatch]);
  return (
    <div>
   
      <DataTable
        data={suppliers}
        columns={columns}
        filterColumn="balance"
        title={'vendor'}
      />
 
                  {showEditModal && (
                <EditVendor
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    data={editData}
                />
            )}
              <DeleteVendor
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDelete}
        itemId={deleteItemId}
      />

    </div>
  )
}

export default Vendors
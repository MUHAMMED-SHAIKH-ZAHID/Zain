import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import DataTable from "../../../components/table/DataTable";
import { suplierColumns } from "../../../components/table/columns/SupplierColumns";
import AddSupplier from "./AddSupplier";
import Modal from "../../../components/commoncomponents/Modal";
import EditSupplier from "./EditSupplier";
import DeleteSupplier from "./DeleteSupplier";
import { deleteSupplier, fetchAllSuppliers, fetchSupplierById } from "../../../redux/features/SupplierSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { SupplierPurchases } from "../../../components/table/columns/SupplierPurchases";
import RetutnForm from "./ReturnForm";



const PurchaseBySupplier = () => {
const navigate = useNavigate()

const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState(null);
const [showReturnModal,setShowReturnModal] = useState(null)
const [viewData,setViewData] = useState(null)
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
    const handleCloseReturnModal = () => {
    setShowReturnModal(false);
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
  console.log(id,"checkign view data before trnasfre")
  setViewData(id)
  setShowReturnModal(true)
}
  const columns = SupplierPurchases(viewClickHandler,editClickHandler,deleteClickHandler);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Supplier Profile"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const { currentpurchase, loading, error } = useSelector((state) => state?.supplier);

                            //     useEffect(() => {
                            //     // Dispatch the action to fetch dashboard data when the component mounts
                            //     dispatch(fetchAllcurrentpurchase());
                            //   }, [dispatch]);
                            console.log(currentpurchase,"debugginge ehesheheheeheheh")
  return (
    <div>
     {!loading &&
     
      <DataTable
        data={currentpurchase}
        columns={columns}
        filterColumn="payment_due_date"
        title={'supplierr'}
      />
     }
 
                  {/* {showEditModal && (
                <EditSupplier
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    data={editData}
                />
            )} */}
                  {showReturnModal && (
                <RetutnForm
                    show={showReturnModal}
                    handleClose={handleCloseReturnModal}
                    data={viewData}
                />
            )}
              {/* <DeleteSupplier
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDelete}
        itemId={deleteItemId}
      /> */}

    </div>
  )
}

export default PurchaseBySupplier
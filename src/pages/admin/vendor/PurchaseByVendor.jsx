import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import { deleteSupplier, fetchAllSuppliers, fetchSupplierById } from "../../../redux/features/SupplierSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { SupplierPurchases } from "../../../components/table/columns/SupplierPurchases";
import RetutnForm from "./ReturnForm";
import { viewPurchaseData } from "../../../redux/features/PurchaseSlice";
import DataTable from "../../../components/table/DataTable";



const PurchaseByVendor = () => {
  const { currentsupplier } = useSelector((state) => state?.supplier);
  const navigate = useNavigate()

const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState(null);
const [showReturnModal,setShowReturnModal] = useState(null)
const [viewData,setViewData] = useState(null)
const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);


    const editClickHandler = (rowData) => {
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



    const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    
    };
    const viewClickHandler = (id) => {
      dispatch(viewPurchaseData(id))
      navigate('/purchase/view')
    }
  const columns = SupplierPurchases(viewClickHandler);

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setHeading("Vendor Profile"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);
  

  const { currentpurchase, loading, error } = useSelector((state) => state?.supplier);
  return (
    <div>
     {!loading &&
     
      <DataTable
        data={currentpurchase}
        columns={columns}
        title={'Vendor'}
        Export={true}
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

export default PurchaseByVendor
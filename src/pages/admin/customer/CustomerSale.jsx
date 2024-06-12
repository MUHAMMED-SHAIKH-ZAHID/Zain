import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CustomerSaleColumns } from "../../../components/table/columns/CustomerSaleColumns";
import { clearHeading, setHeading } from "../../../redux/features/HeadingSlice";
import DataTable from "../../../components/table/DataTable";
import { fetchSaleById } from "../../../redux/features/SalesSlice";
import RetutnForm from "../vendor/ReturnForm";



const CustomerSale = () => {
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
    };

    const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    
    };
    const viewClickHandler = (id) => {
        console.log(id,"checkign view data before trnasfre")
        // dispatch(viewSalesData())
    
        dispatch(fetchSaleById(id.id))
    
        navigate('/sales/view')
      }
  const columns = CustomerSaleColumns(viewClickHandler,editClickHandler,deleteClickHandler);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Supplier Profile"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const { currentSale, loading, error } = useSelector((state) => state?.customers);

                            //     useEffect(() => {
                            //     // Dispatch the action to fetch dashboard data when the component mounts
                            //     dispatch(fetchAllcurrentSale());
                            //   }, [dispatch]);
  return (
    <div>
   
      <DataTable
        data={currentSale || []}
        columns={columns}
        filterColumn="payment_due_date"
        title={'supplierr'}
      />
 
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

export default CustomerSale
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import DataTable from '../../../components/table/DataTable';
import { CustomerColumns } from '../../../components/table/columns/CustomerColumns';
import DeleteCustomer from './DeleteCustomer';
import { fetchAllCustomers, fetchCustomer } from '../../../redux/features/CustomerSlice';
import EditCustomer from './EditCustomer';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Customers"));
    dispatch(fetchAllCustomers());
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const { customers, loading, error } = useSelector(state => state?.customers?.customers);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const navigate = useNavigate()
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
  console.log("debugging the customers",customers)
  const handleDelete = (id) => {
    console.log("Deleting item with id:", id);
    // dispatch(deleteCustomer(id));
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const viewClickHandler = (id) => {
    console.log(id,"checkign view data before trnasfre")
    // dispatch(viewSalesData())

    dispatch(fetchCustomer(id.id))

    navigate('/customer/view')
  }

  const columns = CustomerColumns(viewClickHandler,editClickHandler,deleteClickHandler);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading customers: {error}</div>;

  return (
    <div>
      <DataTable
        data={customers || []} // Ensure data is always an array
        columns={columns}
        filterColumn="state"
        title={'Customer'}
      />
         {showEditModal && (
        <EditCustomer
        
          show={showEditModal}
          handleClose={handleCloseEditModal}
          data={editData}
        />
      )}
      {showDeleteModal && (
        <DeleteCustomer
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDelete}
          itemId={deleteItemId}
        />
      )}
    </div>
  );
};

export default Customer;

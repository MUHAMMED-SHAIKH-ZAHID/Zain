import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import DataTable from '../../../components/table/DataTable';
import { CustomerColumns } from '../../../components/table/columns/CustomerColumns';
import DeleteCustomer from './DeleteCustomer';
import { fetchAllCustomers } from '../../../redux/features/CustomerSlice';

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const deleteClickHandler = (rowData) => {
    setDeleteItemId(rowData.id);
    setShowDeleteModal(true);
  };

  const handleDelete = (id) => {
    console.log("Deleting item with id:", id);
    // dispatch(deleteCustomer(id));
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const columns = CustomerColumns(deleteClickHandler);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading customers: {error}</div>;

  return (
    <div>
      <DataTable
        data={customers || []} // Ensure data is always an array
        columns={columns}
        filterColumn="state"
        title={'Customers'}
      />
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

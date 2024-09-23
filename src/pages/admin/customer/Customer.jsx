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

  const { customers, loading, error } = useSelector(state => state?.customers);

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

 
  const handleDelete = (id) => {
    // dispatch(deleteCustomer(id));
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const viewClickHandler = (id) => {

    dispatch(fetchCustomer(id.id))

    navigate('/customer/view')
  }

  const columns = CustomerColumns(viewClickHandler,editClickHandler);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <DataTable
        data={customers} 
        columns={columns}
        title={'Customer'}
        filterColumn={'route_name'}
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

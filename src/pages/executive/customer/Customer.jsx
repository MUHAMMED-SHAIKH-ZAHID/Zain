import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import DataTable from '../../../components/table/DataTable';
import { CustomerColumns } from '../../../components/table/columns/CustomerColumns';
import DeleteCustomer from './DeleteCustomer';
import EditCustomer from './EditCustomer';
import { useNavigate } from 'react-router-dom';
import { fetchAllCustomers, fetchCustomer } from '../../../redux/features/salesExecutive/CustomerExecutiveSlice';

const Customer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeading("Customers"));
    dispatch(fetchAllCustomers());
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);

  const { customers, loading, error } = useSelector(state => state?.customerexecutive);

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

 

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const viewClickHandler = (id) => {
    // dispatch(viewSalesData())

    dispatch(fetchCustomer(id.id))

    navigate('/executive/customer/view')
  }

  const columns = CustomerColumns(viewClickHandler,editClickHandler);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <DataTable
        data={customers} // Ensure data is always an array
        columns={columns}
        title={'Customers'}
        filterColumn={"route_name"}
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

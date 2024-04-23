import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../../../components/commoncomponents/Modal';
import { useDispatch } from 'react-redux';
import { updateSalesExecutive } from '../../../redux/features/SalesExecutiveSlice';

// Define the validation schema for the sales executive form
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email("Invalid email address").required('Email is required'),
  mobile: Yup.string().matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits').required('Mobile number is required'),
  mobile_2: Yup.string().matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits').nullable(),
  address: Yup.string().required('Address is required'),
  address_2: Yup.string(),
  role: Yup.string().required('Role is required'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

const EditSalesExecutive = ({ show, handleClose, data = {} }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: data.name || '',
      email: data.email || '',
      mobile: data.mobile || '',
      mobile_2: data.mobile_2 || '',
      address: data.address || '',
      address_2: data.address_2 || '',
      role: data.role || '',
      password: data.password || '',
      confirm_password: data.confirm_password || '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values, "Checking values");
      dispatch(updateSalesExecutive({ id: data.id, salesExecutiveData: values }));
      handleClose();
    },
    enableReinitialize: true,
  });

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['name', 'email', 'mobile', 'mobile_2', 'address', 'address_2', 'role', 'password', 'confirm_password'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase())}:</label>
            <input
              type={field.includes('password') ? 'password' : 'text'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...formik.getFieldProps(field)}
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="mt-2 text-sm text-red-600">{formik.errors[field]}</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={handleClose} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Discard
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save
        </button>
      </div>
    </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="edit-sales-executive-modal" content={modalContent} title="Edit Sales Executive" />
  );
};

export default EditSalesExecutive;

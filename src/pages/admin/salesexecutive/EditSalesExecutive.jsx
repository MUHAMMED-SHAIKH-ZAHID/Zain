import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../../../components/commoncomponents/Modal';
import { useDispatch } from 'react-redux';
import { updateSalesExecutive } from '../../../redux/features/SalesExecutiveSlice';
import { toast } from 'react-toastify';

// Define the validation schema for the sales executive form
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email("Invalid email address").required('Email is required'),
  contact: Yup.string().matches(/^[0-9]{10}$/, 'contact must be exactly 10 digits').required('contact number is required'),
  address: Yup.string().required('Address is required'),
  // password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  // confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

const EditSalesExecutive = ({ show, handleClose, data = {} }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: data.name || '',
      email: data.email || '',
      contact: data.contact || '',
      address: data.address || '',
      // password: data.password || '',
      // confirm_password: data.confirm_password || '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateSalesExecutive({ id: data.id, salesExecutiveData: values })).then((res)=>{
        if(res.payload.success){

          toast.success(res.payload.success)
        }
      })
;
      handleClose();
    },
    enableReinitialize: true,
  });

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['name', 'email', 'contact',  'address'].map(field => (
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
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={handleClose} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Discard
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Update Sales Executive
        </button>
      </div>
    </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="edit-sales-executive-modal" content={modalContent} title="Edit Sales Executive" />
  );
};

export default EditSalesExecutive;

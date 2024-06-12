import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { RiCloseLine } from 'react-icons/ri';
import Modal from '../../../components/commoncomponents/Modal';
import { useDispatch } from 'react-redux';
import { createSalesExecutive } from '../../../redux/features/SalesExecutiveSlice';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email("Invalid email address").required('Email is required'),
  mobile: Yup.string().matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits').required('Mobile number is required'),
  mobile_2: Yup.string().matches(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits').nullable(),
  address: Yup.string().required('Address is required'),
  address_2: Yup.string(),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

const CreateSalesExecutive = ({ handleClose }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      mobile_2: '',
      address: '',
      address_2: '',
      password: '',
      confirm_password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(createSalesExecutive(values)).then((res)=>{
        toast.success(res.payload.success)
      })
;
      handleClose();
    },
  });
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
  };
  

  return (
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
          {['name', 'email', 'mobile', 'mobile_2', 'address', 'address_2', 'password', 'confirm_password'].map((field, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">{formatFieldName(field)}</label>
              <input
                type={field.includes('password') ? 'password' : 'text'}
                id={field}
                name={field}
                placeholder={formatFieldName(field)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field]}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  formik.touched[field] && formik.errors[field] ? 'border-red-500' : ''
                }`}
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="mt-2 text-sm text-red-600">{formik.errors[field]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-5">
          <button type="button" onClick={handleClose} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <RiCloseLine className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
            Close
          </button>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Sales Executive
          </button>
        </div>
      </form>
  );
};

export default CreateSalesExecutive;

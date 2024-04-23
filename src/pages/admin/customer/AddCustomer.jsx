import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createCustomer } from '../../../redux/features/CustomerSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email("Invalid email address").required('Email is required'),
  contact_1: Yup.string().required('Contact 1 is required').matches(/^\d{10}$/, 'Must be exactly 10 digits'),
  contact_2: Yup.string().matches(/^\d{10}$/, 'Must be exactly 10 digits').nullable(),
  address_1: Yup.string().required('Address 1 is required'),
  address_2: Yup.string(),
  code: Yup.string(),
  company_name: Yup.string().required('Company name is required'),
  map_url: Yup.string().url('Must be a valid URL'),
  route: Yup.string(),
  sales_person_name: Yup.string(),
  state: Yup.string().required('State is required'),
});

const AddCustomer = ({handleClose}) => {
    const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      contact_1: '',
      contact_2: '',
      address_1: '',
      address_2: '',
      code: '',
      company_name: '',
      map_url: '',
      route: '',
      sales_person_name: '',
      state: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form values:', values);
      dispatch(createCustomer(values))
      // Submit form values to your API
    },
  });

  const labelize = (field) => field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="grid grid-cols-2 gap-4">
      {Object.keys(formik.initialValues).map((field, index) => (
        <div key={index} className={`mb-4 ${field === 'name' ? 'block' : ''}`}> {/* Hide the 'name' field */}
          <label htmlFor={field} className="block text-gray-700 text-sm font-bold mb-2">
            {labelize(field)} {/* Assuming labelize is a function that formats the field names */}
          </label>
          <input
            type={field.includes('email') || field.includes('url') ? 'email' : 'text'}
            id={field}
            name={field}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[field]}
            placeholder={labelize(field)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formik.touched[field] && formik.errors[field] ? 'border-red-500' : ''
            }`}
          />
          {formik.touched[field] && formik.errors[field] && (
            <p className="text-red-500 text-xs italic">{formik.errors[field]}</p>
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-end space-x-4 mt-5">
      <button type="button" onClick={handleClose} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded">
        Close
      </button>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
        Add
      </button>
    </div>
  </form>
  
  );
};

export default AddCustomer;

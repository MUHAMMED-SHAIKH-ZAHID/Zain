import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
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
  route_id: Yup.string().required('Route is required'),
  sales_executive_id: Yup.string().required('Sales executive is required'),
  state: Yup.string().required('State is required'),
});

const AddCustomer = ({ handleClose }) => {
  const { routes,salesExecutives, loading, error } = useSelector(state => state?.customers);
  const dispatch = useDispatch();
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
      route_id: '',
      sales_executive_id: '',
      state: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createCustomer(values));
      handleClose(); // Assume you want to close form on successful submission
    },
  });
  console.log(routes,salesExecutives,"checking what type of data we are getting")
  return (
    <form onSubmit={formik.handleSubmit} className="">
      <div className="grid grid-cols-2 gap-2">
        {/* Dynamically create form fields */}
        {Object.keys(formik.initialValues).map((field, index) => {
  if (field === 'route_id' || field === 'sales_executive_id') {
    const options = field === 'route_id' ? routes : salesExecutives;
    return (
      <div key={index} className="mb-4">
        <label htmlFor={field} className="block text-gray-700 text-sm font-bold mb-2">
          {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </label>
        <select
          id={field}
          name={field}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[field]}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            formik.touched[field] && formik.errors[field] ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select...</option>
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {field === 'route_id' ? option.route : option.name}
            </option>
          ))}
        </select>
        {formik.touched[field] && formik.errors[field] && (
          <p className="text-red-500 text-xs italic">{formik.errors[field]}</p>
        )}
      </div>
    );
  }

 else {
            return (
              <div key={index} className="mb-4">
                <label htmlFor={field} className="block text-gray-700 text-sm font-bold mb-2">
                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                <input
                  type={field.includes('email') || field.includes('url') ? 'email' : 'text'}
                  id={field}
                  name={field}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field]}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    formik.touched[field] && formik.errors[field] ? 'border-red-500' : ''
                  }`}
                  placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                />
                {formik.touched[field] && formik.errors[field] && (
                  <p className="text-red-500 text-xs italic">{formik.errors[field]}</p>
                )}
              </div>
            );
          }
        })}
      </div>
      <div className="flex justify-end space-x-2 mt-5">
        <button type="button" onClick={handleClose} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded">
          Close
        </button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Create Customer
        </button>
      </div>
    </form>
  );
};

export default AddCustomer;

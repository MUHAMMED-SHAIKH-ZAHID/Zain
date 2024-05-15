import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../../../components/commoncomponents/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer } from '../../../redux/features/CustomerSlice';



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

const EditCustomer = ({ show, handleClose, data = {} }) => {
  const { routes,salesExecutives, loading, error } = useSelector(state => state?.customers);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: data.name || '',
      email: data.email || '',
      contact_1: data.contact_1 || '',
      contact_2: data.contact_2 || '',
      address_1: data.address_1 || '',
      address_2: data.address_2 || '',
      code: data.code || '',
      company_name: data.company_name || '',
      map_url: data.map_url || '',
      route_id: data.route_id || '',
      sales_executive_id: data.sales_executive_id || '',
      state: data.state || '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateCustomer({ id: data.id, customerData: values }));
      handleClose();
    },
    enableReinitialize: true,
  });

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={handleClose} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            Close
          </button>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update Customer
          </button>
        </div>
      </form>
  )

  return (
    <Modal visible={show} onClose={handleClose} id="edit-customer-modal" content={modalContent} title="Edit Customer" />

  );
};

export default EditCustomer;

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../components/commoncomponents/Modal';
import { addProduct } from '../../../../redux/features/DataManageSlices/ProductSlice';

// Validation schema using Yup
const validationSchema = Yup.object({
  product_name: Yup.string().required('Product name is required'),
  hsn_code: Yup.string().required('HSN code is required').matches(/^\d{4,6}$/, 'Enter a valid HSN code between 4 and 6 digits'),
  ean_code: Yup.string().required('EAN code is required'),
  category_id: Yup.string().required('Category is required'),
  brand_id: Yup.string().required('Brand is required'),
});

const CreateProduct = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state?.products?.products?.categories);
  const brands = useSelector(state => state?.products?.products?.brands);

  const formik = useFormik({
    initialValues: {
      product_name: '',
      hsn_code: '',
      ean_code: '',
      category_id: '',
      brand_id: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(addProduct(values));
      handleClose();
    },
  });

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Product Name */}
      <FieldGroup label="Product Name" fieldProps={formik.getFieldProps('product_name')} error={formik.touched.product_name && formik.errors.product_name} />
      {/* HSN Code */}
      <FieldGroup label="HSN Code" fieldProps={formik.getFieldProps('hsn_code')} error={formik.touched.hsn_code && formik.errors.hsn_code} />
      {/* EAN Code */}
      <FieldGroup label="EAN Code" fieldProps={formik.getFieldProps('ean_code')} error={formik.touched.ean_code && formik.errors.ean_code} />
      {/* Category Dropdown */}
      <DropdownGroup label="Category" fieldProps={formik.getFieldProps('category_id')} items={categories} error={formik.touched.category_id && formik.errors.category_id} />
      {/* Brand Dropdown */}
      <DropdownGroup label="Brand" fieldProps={formik.getFieldProps('brand_id')} items={brands} error={formik.touched.brand_id && formik.errors.brand_id} />
      {/* Form Buttons */}
      <FormButtons handleClose={handleClose} />
    </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="create-product-modal" content={modalContent} title="Create Product" />
  );
};

// Helper component for input fields
const FieldGroup = ({ label, fieldProps, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}:</label>
    <input
      type="text"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...fieldProps}
    />
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

// Helper component for select dropdowns
const DropdownGroup = ({ label, fieldProps, items, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}:</label>
    <select
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...fieldProps}
    >
      <option value="">Select a {label.toLowerCase()}</option>
      {items.map(item => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

// Form buttons
const FormButtons = ({ handleClose }) => (
  <div className="flex justify-end space-x-2">
    <button type="button" onClick={handleClose} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      Discard
    </button>
    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      Save
    </button>
  </div>
);

export default CreateProduct;

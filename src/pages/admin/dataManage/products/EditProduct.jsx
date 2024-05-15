import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../components/commoncomponents/Modal';
import { updateProduct } from '../../../../redux/features/DataManageSlices/ProductSlice';

// Validation schema using Yup
const validationSchema = Yup.object({
  product_name: Yup.string().required('Product name is required'),
  hsn_code: Yup.string().required('HSN code is required').matches(/^\d{4,6}$/, 'Enter a valid HSN code between 4 and 6 digits'),
  ean_code: Yup.string().required('EAN code is required'),
  category_id: Yup.string().required('Category is required'),
  brand_id: Yup.string().required('Brand is required'),
});

const EditProduct = ({ show, handleClose, data = {} }) => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state?.products?.products?.categories);
  const brands = useSelector(state => state?.products?.products?.brands);

  const formik = useFormik({
    initialValues: {
      product_name: data.product_name || '',
      hsn_code: data.hsn_code || '',
      ean_code: data.ean_code || '',
      category_id: data.category_id || '',
      brand_id: data.brand_id || '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateProduct({ id: data.id, data: values }));
      handleClose();
    },
    enableReinitialize: true,
  });
  console.log("inside edit modal",data);

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">Product Name:</label>
      <input
        type="text"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        {...formik.getFieldProps('product_name')}
      />
      {formik.touched.product_name && formik.errors.product_name && (
        <p className="mt-2 text-sm text-red-600">{formik.errors.product_name}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">HSN Code:</label>
      <input
        type="text"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        {...formik.getFieldProps('hsn_code')}
      />
      {formik.touched.hsn_code && formik.errors.hsn_code && (
        <p className="mt-2 text-sm text-red-600">{formik.errors.hsn_code}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">EAN Code:</label>
      <input
        type="text"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        {...formik.getFieldProps('ean_code')}
      />
      {formik.touched.ean_code && formik.errors.ean_code && (
        <p className="mt-2 text-sm text-red-600">{formik.errors.ean_code}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Category:</label>
      <select
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        {...formik.getFieldProps('category_id')}
      >
        <option value="">Select a category</option>
        {categories?.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      {formik.touched.category_id && formik.errors.category_id && (
        <p className="mt-2 text-sm text-red-600">{formik.errors.category_id}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Brand:</label>
      <select
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        {...formik.getFieldProps('brand_id')}
      >
        <option value="">Select a brand</option>
        {brands?.map(brand => (
          <option key={brand.id} value={brand.id}>{brand.name}</option>
        ))}
      </select>
      {formik.touched.brand_id && formik.errors.brand_id && (
        <p className="mt-2 text-sm text-red-600">{formik.errors.brand_id}</p>
      )}
    </div>

    <div className="flex items-center justify-end gap-2">
          <button 
            type="button" 
            onClick={handleClose}
            className="bg-gray-200 hover:bg-gray-300 text-black font-normal py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-normal py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1"
          >
            Submit
          </button>
        </div>
  </form>
  );
  return (
    <Modal visible={show} onClose={handleClose} id="edit-product-modal" content={modalContent} title="Edit Product" />
  );
};

export default EditProduct;

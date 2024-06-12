import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../components/commoncomponents/Modal';
import { addProduct } from '../../../../redux/features/DataManageSlices/ProductSlice';
import { toast } from 'react-toastify';

// Validation schema using Yup
const validationSchema = Yup.object({
  product_name: Yup.string().required('Product name is required'),
  hsn_code: Yup.string()
    .required('HSN code is required')
    .matches(/^\d{4,6}$/, 'Enter a valid HSN code between 4 and 6 digits'),
  ean_code: Yup.string().required('EAN code is required'),
  category_id: Yup.string().required('Category is required'),
  brand_id: Yup.string().required('Brand is required'),
  tax_rate: Yup.string().required('Tax is required'),
  mrp: Yup.number().required("MRP is Required"),
  p_rate: Yup.number().when('mrp', (mrp, schema) => 
    mrp ? schema.max(mrp, 'Purchase Rate should be less than MRP') : schema
  ),
  s_rate_1: Yup.number().when('mrp', (mrp, schema) => 
    mrp ? schema.max(mrp, 'S1 should be less than MRP') : schema
  ),
  s_rate_2: Yup.number().when('s_rate_1', (s_rate_1, schema) => 
  s_rate_1 ? schema.max(s_rate_1, 'S2 should be less than S1') : schema
  ),
  s_rate_3: Yup.number().when('s_rate_2', (s_rate_2, schema) => 
  s_rate_2 ? schema.max(s_rate_2, 'S3 should be less than MRP') : schema
  ),
});


const CreateProduct = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.products.categories);
  const taxes = useSelector(state => state.products.taxes);
  const [brands, setBrands] = useState([]);
  const [taxRate, setTaxRate] = useState('');

  const formik = useFormik({
    initialValues: {
      product_name: '',
      hsn_code: '',
      ean_code: '',
      category_id: '',
      brand_id: '',
      tax_rate: '',
      mrp: '',
      p_rate:'',
      s_rate_1: '',
      s_rate_2: '',
      s_rate_3: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(addProduct(values)).then((res) => {
        console.log(res, "response of the dispatch");
        toast.success(res.payload.success);
      });
      handleClose();
    },
  });

  useEffect(() => {
    if (formik.values.category_id) {
      const selectedCategory = categories.find(category => category.id == formik.values.category_id);
      if (selectedCategory) {
        setBrands(selectedCategory.brands || []);
        formik.setFieldValue('brand_id', ''); // Reset brand selection when category changes
      }
    } else {
      setBrands([]);
    }
  }, [formik.values.category_id, categories]);

  useEffect(() => {
    if (formik.values.hsn_code) {
      const selectedTax = taxes.find(tax => tax.hsn_code === formik.values.hsn_code);
      if (selectedTax) {
        setTaxRate(selectedTax.tax_rate);
        formik.setFieldValue('tax_rate', selectedTax.tax_rate); // Set tax rate based on HSN code
      }
    } else {
      setTaxRate('');
      formik.setFieldValue('tax_rate', ''); // Reset tax rate when HSN code changes
    }
  }, [formik.values.hsn_code, taxes]);

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6 ">
      <div className="grid grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <DropdownGroup label="Category" fieldProps={formik.getFieldProps('category_id')} items={categories} error={formik.touched.category_id && formik.errors.category_id} />
        {/* Brand Dropdown */}
        <DropdownGroup label="Brand" fieldProps={formik.getFieldProps('brand_id')} items={brands} error={formik.touched.brand_id && formik.errors.brand_id} />
        {/* Product Name */}
        <FieldGroup label="Product Name" fieldProps={formik.getFieldProps('product_name')} error={formik.touched.product_name && formik.errors.product_name} />
        {/* HSN Code */}
        <DropdownGroup label="HSN Code" fieldProps={formik.getFieldProps('hsn_code')} items={taxes.map(tax => ({ id: tax.hsn_code, name: tax.hsn_code }))} error={formik.touched.hsn_code && formik.errors.hsn_code} />
        {/* Tax Rate */}
        <FieldGroup label="Tax Rate" fieldProps={{ ...formik.getFieldProps('tax_rate'), value: taxRate, disabled: true }} error={formik.touched.tax_rate && formik.errors.tax_rate} />
        {/* EAN Code */}
        <FieldGroup label="EAN Code" fieldProps={formik.getFieldProps('ean_code')} error={formik.touched.ean_code && formik.errors.ean_code} />
        {/* MRP */}
        <FieldGroup label="MRP" fieldProps={formik.getFieldProps('mrp')} error={formik.touched.mrp && formik.errors.mrp} />
        <FieldGroup label="Purchase Rate " fieldProps={formik.getFieldProps('p_rate')} error={formik.touched.p_rate && formik.errors.p_rate} />
        {/* Sale Price One */}
        <FieldGroup label="Sale Price One" fieldProps={formik.getFieldProps('s_rate_1')} error={formik.touched.s_rate_1 && formik.errors.s_rate_1} />
        {/* Sale Price Two */}
        <FieldGroup label="Sale Price Two" fieldProps={formik.getFieldProps('s_rate_2')} error={formik.touched.s_rate_2 && formik.errors.s_rate_2} />
        {/* Sale Price Three */}
        <FieldGroup label="Sale Price Three" fieldProps={formik.getFieldProps('s_rate_3')} error={formik.touched.s_rate_3 && formik.errors.s_rate_3} />
      </div>
      {/* Form Buttons */}
      <div className="">
        <FormButtons handleClose={handleClose} />
      </div>
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
    <div className="">

    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
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
    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      Create
    </button>
  </div>
);

export default CreateProduct;

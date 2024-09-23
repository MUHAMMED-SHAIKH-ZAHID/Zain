import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../components/commoncomponents/Modal';
import { updateProduct } from '../../../../redux/features/DataManageSlices/ProductSlice';
import { toast } from 'react-toastify';
import Modal2 from '../../../../components/commoncomponents/Modal2';

// Validation schema using Yup
const validationSchema = Yup.object({
  product_name: Yup.string().required('Product name is required'),
  product_code: Yup.string().required('Product Code is required'),
  hsn_code: Yup.string()
    .required('HSN code is required')
    .max(15, 'Enter a valid HSN code Max 15 digits'),
  ean_code: Yup.string(),
  // .required('EAN code is required')
  // .matches(/^\d{4,12}$/, 'Enter a valid HSN code between 4 and 12 digits'),
  category_id: Yup.string().required('Category is required'),
  brand_id: Yup.string().required('Brand is required'),
  tax_rate: Yup.string().required('Tax is required'),
  mrp: Yup.number().required("MRP is Required"),
  p_rate: Yup.number()
    .required("Purchase Price is Required")
    .when('mrp', (mrp, schema) =>
      mrp ? schema.max(mrp, 'Purchase Price should be less than or equal to MRP') : schema
    ),
  s_rate_1: Yup.number()
    .required("Retail Price 1 is Required")
    .when('p_rate', (p_rate, schema) =>
      p_rate ? schema.min(p_rate, 'Retail should be greater than or equal to Purchase Price') : schema
    )
    .when('mrp', (mrp, schema) =>
      mrp ? schema.max(mrp, 'Retail should be less than or equal to MRP') : schema
    ),
  s_rate_2: Yup.number()
    .required("Dealer Price is Required")
    .when('s_rate_1', (s_rate_1, schema) =>
      s_rate_1 ? schema.max(s_rate_1, 'Dealer Price  should be less than or equal to Retail') : schema
    )
    .when('p_rate', (p_rate, schema) =>
    p_rate ? schema.min(p_rate, 'Dealer Price should be less than or equal to Purchase Price') : schema
    ),
  s_rate_3: Yup.number()
    .required("Wholesale Price  is Required")
    .when('s_rate_2', (s_rate_2, schema) =>
      s_rate_2 ? schema.max(s_rate_2, 'Wholesale Price should be less than or equal to  Dealer Price') : schema
    )
    .when('p_rate', (p_rate, schema) =>
    p_rate ? schema.min(p_rate, 'Wholesale Price should be less than or equal to Purchase Price') : schema
    ),
});



const EditProduct = ({ show, handleClose, data = {} }) => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.products.categories);
  const taxes = useSelector(state => state.products.taxes);
  const [brands, setBrands] = useState([]);
  const [taxRate, setTaxRate] = useState('');
  const [loadingMessage,setLoadingMessage] = useState(false)
  const [taxrates,setTaxrates] = useState([data.tax_rates])



  const formik = useFormik({
    initialValues: {
      product_name: data?.product_name || '',
      hsn_code: data?.hsn_code || '',
      ean_code: data?.ean_code || '',
      category_id: data?.category_id || '',
      brand_id: data?.brand_id || '',
      tax_rate: data?.tax_rate || '',
      mrp: data?.mrp || '',
      p_rate: data?.p_rate || '',
      s_rate_1: data?.s_rate_1 || '',
      s_rate_2: data?.s_rate_2 || '',
      s_rate_3: data?.s_rate_3 || '',
      product_code:data?.product_code || '',
    },
    validationSchema,
    onSubmit: (values) => {
      setLoadingMessage(true)
    const promise =  dispatch(updateProduct({ id: data.id, ...values }))
    promise.then((res)=>{
      if(res.payload.success){
       toast.success(res.payload.success);
       setTimeout(() => {
         handleClose();
       }, 10);
     }
      if(res.payload.error){
       toast.warn(res.payload.error);
      setLoadingMessage(false)
     }
      });
    },
    enableReinitialize:true,
  });

  const FormButtons = ({ handleClose }) => (
    <div className="flex justify-end space-x-2">
      <button type="button" onClick={handleClose} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        Discard
      </button>
      <button
        disabled={loadingMessage}
          type="submit"
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700  ${loadingMessage ? "animate-pulse" : ''}`}
        >
         {loadingMessage ? 'Updating Product...': 'Update Product' }
        </button>
    </div>
  );

  useEffect(() => {
    if (formik.values.category_id) {
      const selectedCategory = categories.find(category => category.id == formik.values.category_id);
      if (selectedCategory) {
        setBrands(selectedCategory.brands || []);
        formik.setFieldValue('brand_id', data.brand_id || ""); // Reset brand selection when category changes
      }
    } else {
      setBrands([]);
    }
    if(data?.tax_rate){
      formik.setFieldValue('tax_rate',data?.tax_rate)
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
  useEffect(() => {
    // Function to handle tax rate setting
    const handleTaxRateSetting = () => {
      if (formik.values.hsn_code) {
        const selectedTax = taxes.find(tax => tax.hsn_code === formik.values.hsn_code);
        if (selectedTax) {
          setTaxRate(selectedTax.tax_rate);
          setTaxrates(selectedTax.tax_rates || []);
          formik.setFieldValue('tax_rate', selectedTax.tax_rate);
        } else {
          setTaxRate('');
          setTaxrates([]);
          formik.setFieldValue('tax_rate', '');
        }
      } else {
        setTaxRate('');
        setTaxrates([]);
        formik.setFieldValue('tax_rate', '');
      }
    };
  
    // Set initial tax rate from data on mount
    if (data?.tax_rate && !formik.values.hsn_code) {
      formik.setFieldValue('tax_rate', data.tax_rate);
      setTaxRate(data.tax_rate);
    }
  
    // Watch for changes in hsn_code and categories
    handleTaxRateSetting();
  
    // Cleanup function
    return () => {
      setTaxRate('');
      setTaxrates([]);
    };
  }, [formik.values.hsn_code, taxes, data?.tax_rate]);
  useEffect(() => {
    if (data?.tax_rate) {
      setTaxRate(data.tax_rate);
      formik.setFieldValue('tax_rate', data.tax_rate);
    }
  }, [data?.tax_rate]);
  

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6 ">
      <div className="grid grid-cols-3 gap-4">
        {/* Category Dropdown */}
        <DropdownGroup label="Brand" fieldProps={formik.getFieldProps('category_id')} items={categories} error={formik.touched.category_id && formik.errors.category_id} />
        {/* Brand Dropdown */}
        <DropdownGroup label="Categrory" fieldProps={formik.getFieldProps('brand_id')} items={brands} error={formik.touched.brand_id && formik.errors.brand_id} />
        {/* Product Name */}
        <FieldGroup label="Product Name" fieldProps={formik.getFieldProps('product_name')} error={formik.touched.product_name && formik.errors.product_name} />
        {/* HSN Code */}
        <DropdownGroup label="HSN Code" fieldProps={formik.getFieldProps('hsn_code')} items={taxes.map(tax => ({ id: tax.hsn_code, name: tax.hsn_code }))} error={formik.touched.hsn_code && formik.errors.hsn_code} />
        {/* Tax Rate */}
        <DropdownGroup label="Tax Rate" fieldProps={formik.getFieldProps('tax_rate')} items={taxrates?.map(tax => ({ id: tax?.tax_rate, name: tax?.tax_rate }))} error={formik.touched.hsn_code && formik.errors.hsn_code} />
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
    <Modal2 visible={show} onClose={handleClose} id="edit-product-modal" content={modalContent} title="Edit Product" size = 'big' />
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


export default EditProduct;

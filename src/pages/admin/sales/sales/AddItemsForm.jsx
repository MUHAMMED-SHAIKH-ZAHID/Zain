import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// Example products list, you may replace this with data fetched from an API or Redux store


const itemSchema = Yup.object().shape({
  product_id: Yup.string().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  inbound: Yup.number().min(0, 'Inbound must be at least 0'),
  outbound: Yup.number().min(0, 'Outbound must be at least 0'),
  price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
  tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
  total: Yup.number(),
  tax_amount: Yup.number(),
  total_inc_tax: Yup.number(),
}).test(
  'inbound-outbound-sum',
  'Sum of Inbound and Outbound must equal Quantity if provided',
  function (values) {
    const { quantity, inbound, outbound } = values;
    const totalInboundOutbound = Number(inbound || 0) + Number(outbound || 0);
    if ((inbound || outbound) && totalInboundOutbound !== quantity) {
      return this.createError({
        path: 'quantity',
        message: `Sum of inbound (${inbound}) and outbound (${outbound}) must equal quantity (${quantity}).`
      });
    }
    return true;
 // If neither inbound nor outbound is provided, do not enforce the sum check
  }
);

const AddItemsForm = ({ items, setItems, onClose }) => {
  const {  products,loading, error } = useSelector((state) => state?.purchases);
  console.log(products,"Consoling products inte h  form")


  const formik = useFormik({
    initialValues: {
      product_id: '',
      quantity: 1,
      inbound: 0,
      outbound: 0,
      price: 0,
      tax: 0,
      total: 0,
      tax_amount: 0,
      total_inc_tax: 0,
      id:'',
    },
    validationSchema: itemSchema,
    onSubmit: (values, { resetForm }) => {
      setItems([...items, values]);
      resetForm();
      onClose();
    },
  });

  useEffect(() => {
    const { quantity, price, tax } = formik.values;
    const total = quantity * price;
    const taxAmount = total * tax / 100;
    const totalInclTax = total + taxAmount;

    formik.setFieldValue('total', total.toFixed(2));
    formik.setFieldValue('tax_amount', taxAmount.toFixed(2));
    formik.setFieldValue('total_inc_tax', totalInclTax.toFixed(2));
  }, [formik.values]);
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product:</label>
        <select
          id="product_id"
          {...formik.getFieldProps('product_id')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a product</option>
          {products?.map(product => (
            <option key={product.id} value={product.id}>{product.product_name}</option>
          ))}
        </select>
        {formik.touched.product_id && formik.errors.product_id && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.product_id}</p>
        )}
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
        <input
          id="quantity"
          type="number"
          {...formik.getFieldProps('quantity')}
          placeholder="Quantity"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.quantity && formik.errors.quantity && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.quantity}</p>
        )}
      </div>

      <div>
        <label htmlFor="inbound" className="block text-sm font-medium text-gray-700">Inbound:</label>
        <input
          id="inbound"
          type="number"
          {...formik.getFieldProps('inbound')}
          placeholder="Inbound Quantity"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.inbound && formik.errors.inbound && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.inbound}</p>
        )}
      </div>

      <div>
        <label htmlFor="outbound" className="block text-sm font-medium text-gray-700">Outbound:</label>
        <input
          id="outbound"
          type="number"
          {...formik.getFieldProps('outbound')}
          placeholder="Outbound Quantity"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.outbound && formik.errors.outbound && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.outbound}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
        <input
          id="price"
          type="number"
          {...formik.getFieldProps('price')}
          placeholder="Price"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.price && formik.errors.price && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="tax" className="block text-sm font-medium text-gray-700">Tax (%):</label>
        <input
          id="tax"
          type="number"
          {...formik.getFieldProps('tax')}
          placeholder="Tax Percentage"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.tax && formik.errors.tax && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.tax}</p>
        )}
      </div>

      <div>
        <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total (Excl. Tax):</label>
        <input
          id="total"
          type="text"
          value={formik.values.total}
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="tax_amount" className="block text-sm font-medium text-gray-700">Tax Amount:</label>
        <input
          id="tax_amount"
          type="text"
          value={formik.values.tax_amount}
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="total_inc_tax" className="block text-sm font-medium text-gray-700">Total (Incl. Tax):</label>
        <input
          id="total_inc_tax"
          type="text"
          value={formik.values.total_inc_tax}
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Item
        </button>
      </div>
    </form>
  );
};

export default AddItemsForm;

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const itemSchema = Yup.object().shape({
  ean: Yup.string().required('EAN is required'),
  qty: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  inbound: Yup.number().min(0, 'Inbound must be at least 0'),
  exbound: Yup.number().min(0, 'Exbound must be at least 0'),
  price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
  tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
}).test(
  'inbound-exbound-sum',
  'Sum of Inbound and Exbound must equal Quantity if provided',
  function (values) {
    const { qty, inbound, exbound } = values;
    if (inbound || exbound) {  // Only validate if either inbound or exbound is provided
      const total = Number(inbound || 0) + Number(exbound || 0);
      const quantity = Number(qty);
      if (total !== quantity) {
        return this.createError({
          path: 'qty', // Attribute that will show the error message
          message: `Sum of inbound (${inbound}) and exbound (${exbound}) must equal qty (${quantity}).`
        });
      }
    }
    return true;  // If neither inbound nor exbound is provided, do not enforce the sum check
  }
);

  

const AddItemsForm = ({ items, setItems, onClose }) => {
  const formik = useFormik({
    initialValues: {
      ean: '',
      qty: 1,
      inbound: 0,
      exbound: 0,
      price: 0,
      tax: 0,
    },
    validationSchema: itemSchema,
    onSubmit: (values, { resetForm }) => {
      setItems([...items, values]);
      resetForm();
      onClose();
    },
  });

  // Calculate the total price for the item
  const calculateTotal = () => {
    const { qty, price, tax } = formik.values;
    return qty * price * (1 + tax / 100);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="ean" className="block text-sm font-medium text-gray-700">EAN Code:</label>
        <input
          id="ean"
          type="text"
          {...formik.getFieldProps('ean')}
          placeholder="EAN Code"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.ean && formik.errors.ean && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.ean}</p>
        )}
      </div>

      <div>
        <label htmlFor="qty" className="block text-sm font-medium text-gray-700">Quantity:</label>
        <input
          id="qty"
          type="number"
          {...formik.getFieldProps('qty')}
          placeholder="Quantity"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.qty && formik.errors.qty && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.qty}</p>
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
        <label htmlFor="exbound" className="block text-sm font-medium text-gray-700">Exbound:</label>
        <input
          id="exbound"
          type="number"
          {...formik.getFieldProps('exbound')}
          placeholder="Exbound Quantity"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {formik.touched.exbound && formik.errors.exbound && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.exbound}</p>
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
        <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Total Price:</label>
        <input
          id="totalPrice"
          type="text"
          value={calculateTotal().toFixed(2)}
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm sm:text-sm"
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

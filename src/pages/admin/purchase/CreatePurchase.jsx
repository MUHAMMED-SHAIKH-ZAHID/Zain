import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';

// Validation Schema using Yup
const purchaseFormSchema = Yup.object().shape({
  purchaseId: Yup.string().required('Purchase ID is required'),
  supplier: Yup.string().required('Supplier is required'),
  purchaseDate: Yup.date().nullable().required('Purchase date is required'),
  payment: Yup.string().required('Payment option is required'),
  paidAmount: Yup.number().when('payment', {
    is: payment => payment === 'Advance' || payment === 'Credit',
    then: Yup.number().required('Paid amount is required').min(0),
    otherwise: Yup.number().notRequired(),
  }),
  balanceAmount: Yup.number().when('payment', {
    is: payment => payment === 'Advance' || payment === 'Credit',
    then: Yup.number().required('Balance amount is required').min(0),
    otherwise: Yup.number().notRequired(),
  }),
  lastDate: Yup.date().nullable().when('payment', {
    is: payment => payment === 'Advance' || payment === 'Credit',
    then: Yup.date().required('Last date is required'),
    otherwise: Yup.date().notRequired(),
  }),
  items: Yup.array().of(
    Yup.object().shape({
      ean: Yup.string().required('EAN is required'),
      qty: Yup.number().min(1).required('Quantity is required'),
      price: Yup.number().min(0.01).required('Price is required'),
      tax: Yup.number().min(0).max(100),
    })
  ).required('At least one item is required'),
  totalDiscount: Yup.number().min(0, 'Total discount must be positive').nullable(),
  status: Yup.string().required('Status is required'),
  modeOfTransaction: Yup.string().required('Mode of transaction is required'),
  notes: Yup.string(),
});

const CreatePurchase = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({ ean: '', qty: 1, price: 0, tax: 0 });

  const formik = useFormik({
    initialValues: {
      purchaseId: '',
      supplier: '',
      purchaseDate: new Date(),
      payment: '',
      paidAmount: '',
      balanceAmount: '',
      lastDate: null,
      items: [],
      totalDiscount: '',
      status: '',
      modeOfTransaction: '',
      notes: '',
    },
    validationSchema: purchaseFormSchema,
    onSubmit: values => {
      console.log('Form values:', values);
      setShowModal(false);
    },
  });

  const handleAddItem = () => {
    formik.setFieldValue('items', [...formik.values.items, currentItem]);
    setCurrentItem({ ean: '', qty: 1, price: 0, tax: 0 });
  };

  const handleDeleteItem = index => {
    const updatedItems = [...formik.values.items];
    updatedItems.splice(index, 1);
    formik.setFieldValue('items', updatedItems);
  };

  const totalCalculation = () => {
    const subtotal = formik.values.items.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);
    const discount = (subtotal * (formik.values.totalDiscount || 0)) / 100;
    return subtotal - discount;
  };

  const renderItemModal = () => (
    <div className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${showModal ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Add New Item</h3>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="EAN Code"
                      value={currentItem.ean}
                      onChange={e => setCurrentItem({ ...currentItem, ean: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={currentItem.qty}
                      onChange={e => setCurrentItem({ ...currentItem, qty: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={currentItem.price}
                      onChange={e => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Tax (%)"
                      value={currentItem.tax}
                      onChange={e => setCurrentItem({ ...currentItem, tax: parseFloat(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleAddItem}
              >
                Add Item
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={formik.handleSubmit} className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="purchaseId" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Purchase ID
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      id="purchaseId"
                      name="purchaseId"
                      type="text"
                      {...formik.getFieldProps('purchaseId')}
                      autoComplete="purchase-id"
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    />
                    {formik.touched.purchaseId && formik.errors.purchaseId && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.purchaseId}</p>
                    )}
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Supplier
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      id="supplier"
                      name="supplier"
                      {...formik.getFieldProps('supplier')}
                      autoComplete="supplier-name"
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select a supplier</option>
                      <option value="supplier1">Supplier 1</option>
                      <option value="supplier2">Supplier 2</option>
                    </select>
                    {formik.touched.supplier && formik.errors.supplier && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.supplier}</p>
                    )}
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Purchase Date
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <DatePicker
                      selected={formik.values.purchaseDate}
                      onChange={date => formik.setFieldValue('purchaseDate', date)}
                      className="max-w-lg block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                    {formik.touched.purchaseDate && formik.errors.purchaseDate && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.purchaseDate}</p>
                    )}
                  </div>
                </div>

                {/* More fields... */}
              </div>
            </div>
          </div>

          {formik.values.items.length > 0 && (
            <div className="mt-10 sm:border-t sm:border-gray-200 sm:pt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Items</h3>
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <ul role="list" className="divide-y divide-gray-200">
                  {formik.values.items.map((item, index) => (
                    <li key={index} className="py-4">
                      <div className="flex space-x-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.ean}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                          <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex-shrink-0 self-center flex">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(index)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            <FiTrash2 className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Item
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit Purchase
              </button>
            </div>
          </div>
        </form>
      </div>

      {showModal && renderItemModal()}
    </>
  );
};

export default CreatePurchase;

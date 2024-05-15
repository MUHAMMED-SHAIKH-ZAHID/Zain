import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../components/commoncomponents/Modal';
import {  purchasePayment } from '../../../../redux/features/PurchaseSlice';
import { useEffect } from 'react';

const validationSchema = Yup.object().shape({
  paid_amount: Yup.number()
    .required('Payment amount is required')
    .min(1, 'Amount must be greater than zero')
    .max(Yup.ref('due_amount'), 'Paid amount cannot be greater than due amount'),
//   paymentMethod: Yup.string().required('Payment method is required'),
//   paymentType: Yup.string().required('Payment type is required'),
  account_id: Yup.string().required('Account is required'),
});

const PaymentModal = ({ show, handleClose, data = {} }) => {
  const dispatch = useDispatch();
  const { paymentModes, loading, error } = useSelector((state) => state?.purchases);

  const formik = useFormik({
    initialValues: {
    //   purchaseNo: data.purchase_number || '',
      paid_amount: '',
    //   paymentMethod: '',
      total: data.grand_total || '',
      due_amount: data.payment_balance || '',
    //   paymentType: '',
      account_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
        // const updatedDueAmount = values.due_amount - values.paid_amount;
        // // Set the updated due amount in the formik values
        // formik.setFieldValue('due_amount', updatedDueAmount);
      
        try {
          // Dispatch the action to update the purchase payment
          await dispatch(purchasePayment({ purchaseData: values, id: data.id }));
          handleClose();
        } catch (error) {
          console.error('Error updating purchase payment:', error);
        }
      }
      
  });

// Inside the PaymentModal component
useEffect(() => {
  // Calculate the updated due amount whenever the paid amount changes
  const updatedDueAmount = data.payment_balance - formik.values.paid_amount;
  
  // Update the formik values with the updated due amount
  formik.setFieldValue('due_amount', updatedDueAmount);
}, [formik.values.paid_amount]); // Run this effect whenever the paid_amount field changes


  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase No:</label>
          <input
            type="text"
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            value={data.purchase_number}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total:</label>
          <input
            type="text"
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            value={formik.values.total}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Due Amount:</label>
          <input
            type="text"
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            value={formik.values.due_amount}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Paid Amount:</label>
          <input
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...formik.getFieldProps('paid_amount')}
          />
          {formik.touched.paid_amount && formik.errors.paid_amount && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.paid_amount}</p>
          )}
        </div>
      </div>
      {/* <div>
        <label className="block text-sm font-medium text-gray-700">Payment Method:</label>
        <select
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...formik.getFieldProps('paymentMethod')}
        >
          <option value="">Select method</option>
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
        {formik.touched.paymentMethod && formik.errors.paymentMethod && (
          <p className="mt-2 text-sm text-red-600">{formik.errors.paymentMethod}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Type:</label>
        <select
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...formik.getFieldProps('paymentType')}
        >
          <option value="">Select type</option>
          <option value="full">Full</option>
          <option value="partial">Partial</option>
        </select>
        {formik.touched.paymentType && formik.errors.paymentType && (
          <p className="mt-2 text-sm text-red-600">{formik.errors.paymentType}</p>
        )}
      </div> */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Account:</label>
        <select
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...formik.getFieldProps('account_id')}
        >
          <option value="">Select account</option>
          {paymentModes.map(mode => (
            <option key={mode.id} value={mode.id}>{mode.account_name}</option>
          ))}
        </select>
        {formik.touched.account_id && formik.errors.account_id && (
          <p className="mt-2 text-sm text-red-600">{formik.errors.account_id}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={handleClose} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Cancel
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Make Payment
        </button>
      </div>
    </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="payment-modal" content={modalContent} title="Make Payment" />
  );
};

export default PaymentModal;

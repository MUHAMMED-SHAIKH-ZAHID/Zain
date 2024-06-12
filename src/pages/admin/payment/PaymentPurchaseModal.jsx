import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Modal from '../../../components/commoncomponents/Modal';
import { purchasePayment } from '../../../redux/features/PurchaseSlice';

const validationSchema = Yup.object().shape({
  paid_amount: Yup.number()
    .required('Payment amount is required')
    .min(1, 'Amount must be greater than zero')
    .max(Yup.ref('due_amount'), 'Paid amount cannot be greater than due amount'),
  account_id: Yup.string().required('Account is required'),
});

const PurchasePaymentModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { purchases, accounts } = useSelector((state) => ({
    purchases: state.purchases.purchases,
    accounts: state.accounts.accounts,
  }));

  const formik = useFormik({
    initialValues: {
      purchase_id: '',
      paid_amount: '',
      total: '',
      due_amount: '',
      account_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(purchasePayment({ purchaseData: values, id: values.purchase_id }));
        handleClose();
      } catch (error) {
        console.error('Error updating purchase payment:', error);
      }
    },
  });

  useEffect(() => {
    const selectedPurchase = purchases.find(purchase => purchase.id === formik.values.purchase_id);
    if (selectedPurchase) {
      formik.setFieldValue('total', selectedPurchase.grand_total);
      formik.setFieldValue('due_amount', selectedPurchase.payment_balance - formik.values.paid_amount);
    }
  }, [formik.values.purchase_id, formik.values.paid_amount, purchases]);

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase ID:</label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...formik.getFieldProps('purchase_id')}
          >
            <option value="">Select purchase</option>
            {purchases.map(purchase => (
              <option key={purchase.id} value={purchase.id}>{purchase.purchase_number}</option>
            ))}
          </select>
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
      <div>
        <label className="block text-sm font-medium text-gray-700">Account:</label>
        <select
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...formik.getFieldProps('account_id')}
        >
          <option value="">Select account</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>{account.account_name}</option>
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
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Make Payment
        </button>
      </div>
    </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="payment-modal" content={modalContent} title="Make Payment" />
  );
};

export default PurchasePaymentModal;

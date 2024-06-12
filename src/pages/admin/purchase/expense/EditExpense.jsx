import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../../../../components/commoncomponents/Modal';
import { updateExpense } from '../../../../redux/features/ExpenseSlice';

const validationSchema = Yup.object().shape({
  expense_type_id: Yup.string().required('Expense Type is required'),
  amount: Yup.string().required('Amount is required'),
  payment_method: Yup.string().required('Payment Method is required'),
  note: Yup.string(),
});

const EditExpense = ({ show, handleClose, data = {} }) => {
  const dispatch = useDispatch();
  const {ExpenseTypes, loading, error } = useSelector((state) => state.expense);


  const formik = useFormik({
    initialValues: {
      expense_type_id: data.expense_type_id || '',
      amount: data.amount || '',
      payment_method: data.payment_method || '',
      note: data.note || '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
    const promise =  dispatch(updateExpense({ id: data.id, expenseData: values }))
    promise.then((res) => {
        console.log(res,"checking the res")
        toast.success(res.payload.suceess);
        handleClose();
      });
    },
    enableReinitialize: true,
  });

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expense_type_id" className="block text-sm font-medium text-gray-700">
            Expense Type
          </label>
          <select
            id="expense_type_id"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...formik.getFieldProps('expense_type_id')}
          >
            <option value="">Select an Expense</option>
            {ExpenseTypes.map(i => (
             <option  key={i?.id} value={i?.id}>{i?.expense_type}</option>
           
          ))}  
          </select>
          {formik.touched.expense_type_id && formik.errors.expense_type_id && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.expense_type_id}</p>
          )}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="text"
            id="amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Amount"
            {...formik.getFieldProps('amount')}
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.amount}</p>
          )}
        </div>
        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            id="payment_method"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...formik.getFieldProps('payment_method')}
          >
            <option value="">Select a Payment Method</option>
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
          {formik.touched.payment_method && formik.errors.payment_method && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.payment_method}</p>
          )}
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">
            Note
          </label>
          <input
            type="text"
            id="note"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Note"
            {...formik.getFieldProps('note')}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-5">
          <button type="button" onClick={handleClose} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 ">
            Close
          </button>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 ">
            Update Expense
          </button>
        </div>
    </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="edit-expense-modal" content={modalContent} title="Edit Expense" />
  );
};

export default EditExpense;

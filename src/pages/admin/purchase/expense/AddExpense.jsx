import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { createExpense } from '../../../../redux/features/ExpenseSlice';

const validationSchema = Yup.object().shape({
  expense_type_id: Yup.string().required('Expense Type is required'),
  amount: Yup.string().required('Amount is required'),
  payment_method: Yup.string().required('Payment Method is required'),
  note: Yup.string(),
});

const AddExpense = ({ handleClose }) => {
  const dispatch = useDispatch();
  const {ExpenseTypes, loading, error } = useSelector((state) => state.expense);
  const [message, setMessage] = useState();
  const [formData, setFormData] = useState({
    expense_type_id: '',
    amount: '',
    payment_method: '',
    note: '',
  });
  console.log(ExpenseTypes,"the types")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        dispatch(createExpense(formData)).then((res) => {
          setMessage(res.payload.success);
          toast.success(res.payload.success);
        });
        handleClose();
      })
      .catch((errors) => {
        errors.inner.forEach((error) => {
          toast.error(error.message);
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expense_type_id" className="block text-sm font-medium text-gray-700">
            Expense Type
          </label>
          <select
            id="expense_type_id"
            name="expense_type_id"
            value={formData.expense_type_id}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select an Expense</option>
          {ExpenseTypes?.map(i => (
             <option  key={i?.id} value={i?.id}>{i?.expense_type}</option>
           
          ))}  
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Amount"
          />
        </div>
        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a Payment Method</option>
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">
            Note
          </label>
          <input
            type="text"
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Note"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-5">
          <button type="button" onClick={handleClose} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 ">
            Close
          </button>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 ">
            Add Expense
          </button>
        </div>
    </form>
  );
};

export default AddExpense;

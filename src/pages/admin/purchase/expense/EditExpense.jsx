import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Modal from '../../../../components/commoncomponents/Modal';
import { updateExpense } from '../../../../redux/features/ExpenseSlice';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
  expense_date: Yup.string().required("Date is Required"),
  expense_type_id: Yup.string().required('Expense Type is required'),
  amount: Yup.string().required('Amount is required'),
  payment_method: Yup.string().required('Payment Method is required'),
  note: Yup.string(),
  reference_type: Yup.string().required('Expense By is required'),
  reference_id: Yup.string()
  .when('reference_type', (reference_type, schema) =>
  reference_type === 'supplier' || reference_type === 'customer' ? schema.required('Expense By is required') : schema.notRequired()
),
  account_id: Yup.string()
  .when('payment_method', (payment_method, schema) =>
    payment_method === 'bank' ? schema.required('Mode of transaction is required') : schema.notRequired()
  ),
reference_no: Yup.number()
  .when('payment_method', (payment_method, schema) =>
    ['cheque', 'rtgs', 'neft'].includes(payment_method)
      ? schema.required('Reference Number is required').min(0)
      : schema.notRequired()
  ),
reference_date: Yup.string()
  .when('payment_method', (payment_method, schema) =>
    ['cheque', 'rtgs', 'neft'].includes(payment_method)
      ? schema.required('Please select Reference Date')
      : schema.notRequired()
  ),
});

const EditExpense = ({ show, handleClose, data = {} }) => {
  const dispatch = useDispatch();
  const [loadingMessage,setLoadingMessage] = useState(false)

  const { ExpenseTypes, suppliers, customers,accounts } = useSelector((state) => state.expense);


  const formik = useFormik({
    initialValues: {
      expense_date:data?.expense_date||'',
      reference_date:data?.reference_date || '',
      reference_id:data?.reference_id || '',
      reference_no:data?.reference_no || '',
      reference_type:data?.reference_type || '',
      expense_type_id: data.expense_type_id || '',
      amount: data.amount || '',
      payment_method: data?.payment_method || '',
      note: data?.note || '',
      account_id:data?.account_id || '' ,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoadingMessage(true)
    const promise =  dispatch(updateExpense({ id: data.id, expenseData: values }))
    promise.then((res) => {
        toast.success(res.payload.suceess);
        handleClose();
      });
    },
    enableReinitialize: true,
  });

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
    <div className='w-full'>
        <label htmlFor="expense_date" className="block text-sm font-medium text-gray-700">Date:</label>
        <div className="border-2 rounded-md mt-1" >

        <DatePicker
            selected={formik.values.expense_date}
            onChange={(date) => formik.setFieldValue('expense_date', date)}
            className="mt-1 block w-full px-3 py-1 text-sm cursor-pointer border-gray-300 rounded-md shadow-sm outline-none"
            />
        </div>
        {formik.touched.expense_date && formik.errors.expense_date && (
            <p className="text-red-500 text-xs italic">{formik.errors.expense_date}</p>
        )}
    </div>
      <div>
        <label htmlFor="reference_type" className="block text-sm font-medium text-gray-700">Expense By</label>
        <select
          {...formik.getFieldProps('reference_type')}
          id="reference_type"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onChange={(e) => {
            formik.setFieldValue('reference_type', e.target.value);
            formik.setFieldValue('reference_id', '');
          }}
        >
          <option value="">Select Expense By</option>
          <option value="supplier">Supplier</option>
          <option value="customer">Customer</option>
          <option value="other">Other</option>
        </select>
        {formik.touched.reference_type && formik.errors.reference_type ? (
          <span className="mt-1 text-sm text-red-500">{formik.errors.reference_type}</span>
        ) : null}
      </div>

      { (formik.values.reference_type) != "other" ?
     
     <div>
     <label htmlFor="reference_id" className="block text-sm font-medium text-gray-700">Choose Company</label>
     <select
       {...formik.getFieldProps('reference_id')}
       id="reference_id"
       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
     >
       <option value="">Select Company</option>
       {formik.values.reference_type === 'supplier' &&
         suppliers?.map((item) => (
           <option key={item.id} value={item.id}>{item.company_name}</option>
         ))}
       {formik.values.reference_type === 'customer' &&
         customers?.map((item) => (
           <option key={item.id} value={item.id}>{item.company_name}</option>
         ))}
     </select>
     {formik.touched.reference_id && formik.errors.reference_id ? (
       <span className="mt-1 text-sm text-red-500">{formik.errors.reference_id}</span>
     ) : null}
   </div> :
   null
     }

      <div>
        <label htmlFor="expense_type_id" className="block text-sm font-medium text-gray-700">Expense Type</label>
        <select
          {...formik.getFieldProps('expense_type_id')}
          id="expense_type_id"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select an Expense</option>
          {ExpenseTypes?.map((i) => (
            <option key={i?.id} value={i?.id}>{i?.expense_type}</option>
          ))}
        </select>
        {formik.touched.expense_type_id && formik.errors.expense_type_id ? (
          <span className="mt-1 text-sm text-red-500">{formik.errors.expense_type_id}</span>
        ) : null}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="text"
          {...formik.getFieldProps('amount')}
          id="amount"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Amount"
        />
        {formik.touched.amount && formik.errors.amount ? (
          <span className="mt-1 text-sm text-red-500">{formik.errors.amount}</span>
        ) : null}
      </div>

      <div>
        <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">Payment Method</label>
        <select
          {...formik.getFieldProps('payment_method')}
          id="payment_method"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Transaction method</option>
          <option value="bank">Bank</option>
          <option value="cheque">Cheque</option>
          <option value="rtgs">RTGS</option>
          <option value="neft">NEFT</option>
          <option value="cash">Cash</option>
        </select>
        {formik.touched.payment_method && formik.errors.payment_method ? (
          <span className="mt-1 text-sm text-red-500">{formik.errors.payment_method}</span>
        ) : null}
      </div>

      {formik.values.payment_method == "bank" &&          <div>
      <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Account:</label>
      <select
id="account_id"
{...formik.getFieldProps('account_id')}
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
<option value="">Select Bank Account</option>
{accounts.map((item) => (
<option value={item.id} key={item.id}>
  {item.account_name}
</option>
))}
</select>

      {formik.touched.account_id && formik.errors.account_id && (
        <div className="text-sm text-red-600">{formik.errors.account_id}</div>
      )}
    </div> }

    {formik.values.payment_method === 'cheque' || formik.values.payment_method === 'rtgs' || formik.values.payment_method === 'neft' ? (
    <>
    <div className="">
    <label htmlFor="reference_no" className="block text-sm font-medium text-gray-700">Reference Number</label>
      <input
        type="number"
        {...formik.getFieldProps('reference_no')}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Reference Number"
      />
      {formik.touched.reference_no && formik.errors.reference_no && (
        <div className="text-sm text-red-600">{formik.errors.reference_no}</div>
      )}

    </div>
    

    
      <div className="">
      <label htmlFor="reference_date" className="block text-sm font-medium text-gray-700">Reference Date:</label>

      <DatePicker
        selected={formik.values.reference_date}
        onChange={date => formik.setFieldValue('reference_date', date)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      {formik.touched.reference_date && formik.errors.reference_date && (
        <div className="text-sm text-red-600">{formik.errors.reference_date}</div>
      )}
      </div>
    </>
  ) : null}

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note</label>
        <input
          type="text"
          {...formik.getFieldProps('note')}
          id="note"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Note"
        />
      </div>
    </div>

    <div className="flex justify-end space-x-2 mt-5">
      <button
        type="button"
        onClick={handleClose}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2"
      >
        Close
      </button>
      <button disabled={loadingMessage} type="submit"  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loadingMessage ? "animate-pulse" : ''}`} >
         {loadingMessage ? 'Updating Debit Note...': 'Update Debit Note' }
        </button>
    </div>
  </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="edit-expense-modal" content={modalContent} title="Edit Expense" />
  );
};

export default EditExpense;

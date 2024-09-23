import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { createPayment } from '../../../redux/features/salesExecutive/ExecutivePaymentSlice';



const validationSchema = Yup.object().shape({
  person_id: Yup.string(),
  payment_date: Yup.string().required("Date is Required"),
  total: Yup.string().required('Amount is required'),
  paid_amount: Yup.number().min(1,"payment should be atlest one").required('Amount is required'),
  oldpaid_amount: Yup.string(),
  due_amount: Yup.string(),
  payment_mode: Yup.string().required('Payment Method is required'),
  note: Yup.string(),
  reference_type: Yup.string().required('Expense By is required'),
  reference_id: Yup.string().required('Choose Customer/Supplier is required'),
  account_id: Yup.string()
  .when('payment_mode', (payment_mode, schema) =>
    payment_mode === 'bank' ? schema.required('Mode of transaction is required') : schema.notRequired()
  ),
reference_no: Yup.number()
  .when('payment_mode', (payment_mode, schema) =>
    ['cheque', 'rtgs', 'neft'].includes(payment_mode)
      ? schema.required('Reference Number is required').min(0)
      : schema.notRequired()
  ),
reference_date: Yup.string()
  .when('payment_mode', (payment_mode, schema) =>
    ['cheque', 'rtgs', 'neft'].includes(payment_mode)
      ? schema.required('Please select Reference Date')
      : schema.notRequired()
  ),
bank_name: Yup.string()
  .when('payment_mode', (payment_mode, schema) =>
    ['cheque', 'rtgs', 'neft'].includes(payment_mode)
      ? schema.required('Please select Reference Date')
      : schema.notRequired()
  ),
});

const AddExecutivePayment = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { customers, vendors,accounts } = useSelector((state) => state.executivepayments);
  const [selectedPurchase,setSelectedPurchase]= useState([])
  const [selectedSale,setSelectedSale]= useState([])
  const [loadingMessage,setLoadingMessage] = useState(false)


  const formik = useFormik({
    initialValues: {
      payment_date:Date.now(),
      reference_date:Date.now(),
      total: '',
      paid_amount: '',
      due_amount: '',
      payment_mode: '',
      note: '',
      reference_type: '',
      reference_id: '',
      reference_no:'',
      person_id:'',
      oldpaid_amount:'',
      bank_name:'',
      account_id:'',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let errors ={}
        if (values.payment_mode === 'bank' && !values.account_id) {
          errors.account_id = 'Account Id is Required';
        }
        if (['rtgs', 'neft','cheque'].includes(values.payment_mode)) {
          if (!values.reference_no) {
            errors.reference_no = 'Reference Number Is Required';
          }
          if (!values.reference_date) {
            errors.reference_date = 'Reference Date Is Required';
          }
          if (!values.bank_name) {
            errors.bank_name = 'Bank Name Is Required';
          }
        }
        if( parseFloat(formik.values.paid_amount) > parseFloat(formik.values.due_amount) ){
          errors.paid_amount = "Paid Amount should not exced Due Amount"
        }
        if (Object.keys(errors).length > 0) {
          formik.setErrors(errors);
          return;
        }
        formik.values.due_amount = parseFloat(formik.values.due_amount) -  parseFloat(formik.values.paid_amount)
        formik.values.oldpaid_amount = parseFloat(formik.values.paid_amount) + parseFloat(formik.values.oldpaid_amount)
        formik.values.paid_amount = parseFloat(formik.values.paid_amount)
        const formattedValues = {
          ...values,
          payment_date: format(new Date(values.payment_date), 'yyyy-MM-dd'),
          reference_date: format(new Date(values.reference_date), 'yyyy-MM-dd'),
        };
        setLoadingMessage(true)
        const promise = dispatch(createPayment(formattedValues));
        promise.then((res) => {
          if(res.payload.success){
            toast.success(res.payload.success);
            setTimeout(() => {
              setSubmitting(false);
              handleClose();
            }, 10);
  
          }
          if (res.payload.error) {
            toast.error(res.payload.error);
          }
      
        });
      } catch (error) {
        console.error('Error creating expense:',error);
      }
    },
  });

  useEffect(()=>{
      formik.setFieldValue('reference_type',"invoice")
//   
   if(formik.values.reference_type == 'invoice'){
    const findpaidAmount = customers.find((item)=>{ return  item.id == formik.values.person_id})
    const sales = findpaidAmount?.sales
    setSelectedSale(sales)
    if(formik.values.reference_id){
      const selectedbill = sales.find((item)=> item.id == formik.values.reference_id)
      formik.setFieldValue('due_amount',selectedbill?.payment_balance)
      formik.setFieldValue('total',selectedbill?.grand_total)
      formik.setFieldValue('oldpaid_amount',selectedbill?.paid_amount)
    }
   }
  },[formik.values.person_id,formik.values.reference_id])


  

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
        
      <div className="grid grid-cols-2 gap-4">
      <div className='w-full'>
          <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">Date:</label>
          <div className="border-2 rounded-md mt-1" >

          <DatePicker
              selected={formik.values.payment_date}
              onChange={(date) => formik.setFieldValue('payment_date', date)}
              className="mt-1 block w-full px-3 py-1 text-sm cursor-pointer border-gray-300 rounded-md shadow-sm outline-none"
              />
          </div>
          {formik.touched.payment_date && formik.errors.payment_date && (
              <p className="text-red-500 text-xs italic">{formik.errors.payment_date}</p>
          )}
      </div>
        {/* <div>
          <label htmlFor="reference_type" className="block text-sm font-medium text-gray-700">Payment By</label>
          <select
            {...formik.getFieldProps('reference_type')}
            id="reference_type"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => {
              formik.setFieldValue('reference_type', e.target.value);
              formik.setFieldValue('reference_id', '');
            }}
          >
            <option value="">Select Payment By</option>
            <option value="bill">Bill</option>
            <option value="invoice">Invoice</option>
          </select>
          {formik.touched.reference_type && formik.errors.reference_type ? (
            <span className="mt-1 text-sm text-red-500">{formik.errors.reference_type}</span>
          ) : null}
        </div> */}

        <div>
          <label htmlFor="person_id" className="block text-sm font-medium text-gray-700">Choose Company</label>
          <select
            {...formik.getFieldProps('person_id')}
            id="person_id"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select CompanyName</option>
            {formik.values.reference_type === 'invoice' &&
              customers?.map((item) => (
                <option key={item.id} value={item.id}>{item.company_name}</option>
              ))}
            {formik.values.reference_type === 'bill' &&
              vendors?.map((item) => (
                <option key={item.id} value={item.id}>{item.company_name}</option>
              ))}
          </select>
          {formik.touched.reference_id && formik.errors.reference_id ? (
            <span className="mt-1 text-sm text-red-500">{formik.errors.reference_id}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="reference_id" className="block text-sm font-medium text-gray-700">Choose {formik.values.reference_type === 'bill' ? 'Bill' : 'Invoice'   }</label>
          <select
            {...formik.getFieldProps('reference_id')}
            id="reference_id"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select {formik.values.reference_type === 'bill' ? 'Bill' : 'Invoice'}</option>
            {formik.values.reference_type === 'bill' &&
              selectedPurchase?.map((item) => (
                <option key={item.id} value={item.id}>{item.bill_number}</option>
              ))}
            {formik.values.reference_type === 'invoice' &&
              selectedSale?.map((item) => (
                <option key={item.id} value={item.id}>{item.invoice_number}</option>
              ))}
          </select>
          {formik.touched.reference_id && formik.errors.reference_id ? (
            <span className="mt-1 text-sm text-red-500">{formik.errors.reference_id}</span>
          ) : null}
        </div>

      

        <div>
          <label htmlFor="total" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
          disabled
            type="text"
            {...formik.getFieldProps('total')}
            id="total"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Amount"
          />
          {formik.touched.total && formik.errors.total ? (
            <span className="mt-1 text-sm text-red-500">{formik.errors.total}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="oldpaid_amount" className="block text-sm font-medium text-gray-700">Old Paid Amount</label>
          <input
            type="text"
            disabled
            {...formik.getFieldProps('oldpaid_amount')}
            id="oldpaid_amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Paid Amount"
          />
          {formik.touched.oldpaid_amount && formik.errors.oldpaid_amount ? (
            <span className="mt-1 text-sm text-red-500">{formik.errors.oldpaid_amount}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="due_amount" className="block text-sm font-medium text-gray-700">Due Amount</label>
          <input
          disabled
            type="text"
            {...formik.getFieldProps('due_amount')}
            id="due_amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Due Amount"
          />
          {formik.touched.due_amount && formik.errors.due_amount ? (
            <span className="mt-1 text-sm text-red-500">{formik.errors.due_amount}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="paid_amount" className="block text-sm font-medium text-gray-700">New Amount</label>
          <input
            type="text"
            {...formik.getFieldProps('paid_amount')}
            id="paid_amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="New Amount"
          />
          {formik.touched.paid_amount && formik.errors.paid_amount ? (
            <span className="mt-1 text-sm text-red-500">{formik.errors.paid_amount}</span>
          ) : null}
        </div>

        <div>
          <label htmlFor="payment_mode" className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            {...formik.getFieldProps('payment_mode')}
            id="payment_mode"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Transaction method</option>
            <option value="bank">Bank</option>
            <option value="cheque">Cheque</option>
            <option value="rtgs">RTGS</option>
            <option value="neft">NEFT</option>
            <option value="cash">Cash</option>
          </select>
          {formik.touched.payment_mode && formik.errors.payment_mode ? (
            <span className="mt-1 text-sm text-red-500">{formik.errors.payment_mode}</span>
          ) : null}
        </div>

        {formik.values.payment_mode == "bank" &&          <div>
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
  
      {formik.values.payment_mode === 'cheque' || formik.values.payment_mode === 'rtgs' || formik.values.payment_mode === 'neft' ? (
      <>
      <div className="">
        <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700">Bank Name</label>
          <input
            type="text"
            {...formik.getFieldProps('bank_name')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Bank Name"
          />
          {formik.touched.bank_name && formik.errors.bank_name && (
            <div className="text-sm text-red-600">{formik.errors.bank_name}</div>
          )}

        </div>
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
        <div className="border-2 rounded-md mt-1" >

        <DatePicker
          selected={formik.values.reference_date}
          onChange={date => formik.setFieldValue('reference_date', date)}
          className="mt-1 block w-full px-3 py-1 text-sm cursor-pointer border-gray-300 rounded-md shadow-sm outline-none"
          />
        </div>
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
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2"
        >
          Add Payment
        </button>
      </div>
    </form>
  );
};

export default AddExecutivePayment;

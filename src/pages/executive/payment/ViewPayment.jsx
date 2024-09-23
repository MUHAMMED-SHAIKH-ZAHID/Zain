import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { createPayment } from '../../../redux/features/PaymentSlice';
import Modal2 from '../../../components/commoncomponents/Modal2';



const validationSchema = Yup.object().shape({
  person_id: Yup.string(),
  payment_date: Yup.string().required("Date is Required"),
  total: Yup.string().required('Amount is required'),
  paid_amount: Yup.string().required('Amount is required').min(1,"payment should be atlest one"),
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
});

const ViewPayment = ({ show, handleClose, data = {} }) => {
  const dispatch = useDispatch();
  const { customers, vendors,accounts } = useSelector((state) => state.executivepayments);
  const [selectedPurchase,setSelectedPurchase]= useState([])
  const [selectedSale,setSelectedSale]= useState([])

  const formik = useFormik({
    initialValues: {
      payment_date:data?.payment_date || '',
      reference_date:data?.reference_date || '',
      total: data?.total || '',
      paid_amount: data?.paid_amount || '',
      due_amount: data?.due_amount || '',
      payment_mode: data?.payment_mode || '',
      note: data?.note || '',
      reference_type: data?.reference_type || '',
      reference_id: data?.reference_id || '',
      reference_no:data?.reference_no ||'',
      person_id:data?.supplier?.id ||data?.customer?.id || '',
      oldpaid_amount:data?.oldpaid_amount || 0,
      bank_name:data?.bank_name || '',
      account_id:data?.account_id || '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let errors ={}
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
        const promise = dispatch(createPayment(formattedValues));
        promise.then((res) => {
          if(res.payload.success){
            toast.success(res.payload.success);
            setTimeout(() => {
              setSubmitting(false);
              handleClose();
            }, 1000);
  
          }
          if (res.payload.error) {
            toast.error(res.payload.error);
          }
      
        });
      } catch (error) {
        console.error('Error creating expense:',error);
      }
    },
   enableReinitialize:true
  });

  useEffect(()=>{
   if(formik.values.reference_type == 'bill'){
    const findpaidAmount = vendors?.find((item)=>{ return  item.id == formik.values.person_id})
    const purchases = findpaidAmount?.purchases
    setSelectedPurchase(purchases)
    if(formik.values.reference_id){
      const selectedbill = purchases?.find((item)=> item.id == formik.values.reference_id)
      formik.setFieldValue('due_amount',selectedbill?.payment_balance)
      formik.setFieldValue('total',selectedbill?.grand_total)
      formik.setFieldValue('oldpaid_amount',selectedbill?.paid_amount)
    }

   }
   if(formik.values.reference_type == 'invoice'){
    const findpaidAmount = customers?.find((item)=>{ return  item.id == formik.values.person_id})
    const sales = findpaidAmount?.sales
    setSelectedSale(sales)
    if(formik.values.reference_id){
      const selectedbill = sales?.find((item)=> item.id == formik.values.reference_id)
      formik.setFieldValue('due_amount',selectedbill?.payment_balance)
      formik.setFieldValue('total',selectedbill?.grand_total)
      formik.setFieldValue('oldpaid_amount',selectedbill?.paid_amount)
    }
   }
  },[formik.values.person_id,formik.values.reference_id])

const modalContent = (
  <form onSubmit={formik.handleSubmit} className="space-y-4">
        
  <div className="grid grid-cols-1 gap-4">
  <div className='w-full flex items-center'>
      <label htmlFor="payment_date" className="block w-32 text-sm font-medium text-gray-700">Date:</label>
      <div className="" >

      <DatePicker
      disabled
          selected={formik.values.payment_date}
          onChange={(date) => formik.setFieldValue('payment_date', date)}
          className="mt-1 block w-full px-3  text-sm "
          />
      </div>
      {formik.touched.payment_date && formik.errors.payment_date && (
          <p className="text-red-500 text-xs italic">{formik.errors.payment_date}</p>
      )}
  </div>
    <div className='flex w-full items-center'>
      <div className="">

      <label htmlFor="reference_type" className="block text-sm w-32 font-medium text-gray-700">Payment By</label>
      </div>
      <div className="">

      <select
      disabled
        {...formik.getFieldProps('reference_type')}
        id="reference_type"
        className="mt-1 block w-full appearance-none text-sm px-2"
        onChange={(e) => {
          formik.setFieldValue('reference_type', e.target.value);
          // formik.setFieldValue('reference_id', '');
        }}
      >
        <option value="">Select Payment By</option>
        <option value="bill">Bill</option>
        <option value="invoice">Invoice</option>
      </select>
      </div>
      {formik.touched.reference_type && formik.errors.reference_type ? (
        <span className="mt-1 text-sm text-red-500">{formik.errors.reference_type}</span>
      ) : null}
    </div>

    <div className='flex w-full'>
      <label htmlFor="person_id" className="block text-sm w-40 font-medium text-gray-700"> {formik.values.reference_type === 'bill' ? 'Vendor' : 'Company'   } Name</label>
      <select
      disabled
        {...formik.getFieldProps('person_id')}
        id="person_id"
        className="mt-1 block w-full appearance-none text-sm px-2 "
      >
        <option value="">Select {formik.values.reference_type === 'bill' ? 'Vendor' : 'Customer'}</option>
        {formik.values.reference_type === 'invoice' &&
         
            <option key={data?.customer?.id} value={data?.customer?.id}>{data?.customer?.company_name}</option>
          }
        {formik.values.reference_type === 'bill' &&
            <option key={data?.supplier?.id} value={data?.supplier?.id}>{data?.supplier?.first_name}</option>

        }
      </select>
      {formik.touched.reference_id && formik.errors.reference_id ? (
        <span className="mt-1 text-sm text-red-500">{formik.errors.reference_id}</span>
      ) : null}
    </div>
    <div className='w-full flex items-center'>
      <label htmlFor="reference_id" className="block w-40 text-sm font-medium text-gray-700"> {formik.values.reference_type === 'bill' ? 'Bill' : 'Invoice'   } Number</label>
      <select
      disabled
        {...formik.getFieldProps('reference_id')}
        id="reference_id"
        className="mt-1 block w-full appearance-none text-sm px-2 "
      >
        <option value="">Select {formik.values.reference_type === 'bill' ? 'Bill' : 'Invoice'}</option>
        {formik.values.reference_type == 'bill' &&
         
            <option key={data?.purchase?.id} value={data?.purchase?.id}>{data?.purchase?.bill_number}</option>
          }
        {formik.values.reference_type == 'invoice' &&
                      <option key={data?.sale?.id} value={data?.sale?.id}>{data?.sale?.invoice_number}</option>

        }
      </select>
      {formik.touched.reference_id && formik.errors.reference_id ? (
        <span className="mt-1 text-sm text-red-500">{formik.errors.reference_id}</span>
      ) : null}
    </div>

  

    <div className='w-full flex items-center'>
      <label htmlFor="total" className="block text-sm w-40 font-medium text-gray-700">Amount</label>
      <input
      disabled
        type="text"
        {...formik.getFieldProps('total')}
        id="total"
        className="mt-1 block w-full appearance-none text-sm px-2 "
        placeholder="Amount"
      />
    </div>
 
  {data?.oldpaid_amount != '0' &&
  
    <div className='flex items-center w-full'>
      <label htmlFor="oldpaid_amount" className="block w-40 text-sm font-medium text-gray-700">Old Paid Amount</label>
      <input
        type="text"
        disabled
        {...formik.getFieldProps('oldpaid_amount')}
        id="oldpaid_amount"
        className="mt-1 block w-full appearance-none text-sm px-2 "
        placeholder="Paid Amount"
      />
   
    </div>
  }
    <div className='flex items-center w-full'>
      <label htmlFor="due_amount" className="block w-40 text-sm font-medium text-gray-700">Due Amount</label>
      <input
      disabled
        type="text"
        {...formik.getFieldProps('due_amount')}
        id="due_amount"
        className="mt-1 block w-full appearance-none text-sm px-2 "
        placeholder="Due Amount"
      />

    </div>
    <div className='flex items-center w-full'>
      <label htmlFor="paid_amount" className="block w-40 text-sm font-medium text-gray-700">New Amount</label>
      <input
        type="text"
        disabled
        {...formik.getFieldProps('paid_amount')}
        id="paid_amount"
        className="mt-1 block w-full appearance-none text-sm px-2 "
        placeholder="New Amount"
      />
      {formik.touched.paid_amount && formik.errors.paid_amount ? (
        <span className="mt-1 text-sm text-red-500">{formik.errors.paid_amount}</span>
      ) : null}
    </div>

    <div className='flex w-full items-center'>
      <label htmlFor="payment_mode" className="block w-40 text-sm font-medium text-gray-700">Payment Method</label>
      <select
      disabled
        {...formik.getFieldProps('payment_mode')}
        id="payment_mode"
        className="mt-1 block w-full appearance-none text-sm px-2 "
      >
        <option value="">Select Transaction method</option>
        <option value="bank">Bank</option>
        <option value="cheque">Cheque</option>
        <option value="rtgs">RTGS</option>
        <option value="neft">NEFT</option>
        <option value="cash">Cash</option>
      </select>
    </div>

    {formik.values.payment_mode == "bank" &&          <div className='flex w-full items-center'>
    <label htmlFor="account_id" className="bloc w-40 text-sm font-medium text-gray-700">Account:</label>
    <select 
    disabled  
id="account_id"
{...formik.getFieldProps('account_id')}
className="mt-1 block w-full appearance-none text-sm px-2 "
>
<option value="">Select Bank Account</option>
{accounts.map((item) => (
<option value={item.id} key={item.id}>
{item.account_name}
</option>
))}
</select>


  </div> }

  {formik.values.payment_mode === 'cheque' || formik.values.payment_mode === 'rtgs' || formik.values.payment_mode === 'neft' ? (
  <>
  <div className="flex w-full items-center">
      <label htmlFor="bank_name" className="block text-sm w-40 font-medium text-gray-700">Bank Name</label>
        <input
        disabled
          type="text"
          {...formik.getFieldProps('bank_name')}
          className="mt-1 block w-full px-3 "
          placeholder="Bank Name"
        />
        {formik.touched.bank_name && formik.errors.bank_name && (
          <div className="text-sm text-red-600">{formik.errors.bank_name}</div>
        )}

      </div>
  <div className="flex w-full items-center">
  <label htmlFor="reference_no" className="block w-40 text-sm font-medium text-gray-700">Reference Number</label>
    <input
    disabled
      type="number"
      {...formik.getFieldProps('reference_no')}
      className="mt-1 block w-full appearance-none text-sm px-2 "
      placeholder="Reference Number"
    />

  </div>
  

  
    <div className="flex items-center w-full">
    <label htmlFor="reference_date" className="block w-32 text-sm font-medium text-gray-700">Reference Date:</label>

    <DatePicker
    disabled
      selected={formik.values.reference_date}
      onChange={date => formik.setFieldValue('reference_date', date)}
      className="mt-1 block w-full "
    />
    </div>
  </>
) : null}

    <div className='flex items-center w-full'>
      <label htmlFor="note" className="block w-40 text-sm font-medium text-gray-700">Note</label>
     {data?.note}
    </div>
  </div>
</form>
)
  

  return (
    <Modal2 visible={show} onClose={handleClose} id="view-Payment-modal" content={modalContent} title="View Payment" size='lg' />

  );
};

export default ViewPayment;

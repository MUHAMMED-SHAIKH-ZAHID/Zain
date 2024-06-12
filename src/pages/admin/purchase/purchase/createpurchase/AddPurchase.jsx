import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddItemsForm from './AddItemsForm'; // Ensure this component is implemented
import Modal from '../../../../../components/commoncomponents/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createPurchase } from '../../../../../redux/features/PurchaseSlice';
import { clearHeading, setHeading } from '../../../../../redux/features/HeadingSlice';
import { CiEdit } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import {  editPurchaseColumn, updatePurchase } from '../../../../../redux/features/PurchaseSlice';
import EditItemsForm from '../EditItemsForm';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LuImport } from "react-icons/lu";
import { format } from 'date-fns';





const itemSchema = Yup.object().shape({
  product_id: Yup.string().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
  mrp: Yup.number()
  .min(1, 'MRP must be at least 1')
  .required('MRP is required')
  .when('price', (price, schema) => {
    return schema.min(price, 'MRP must be equal to or greater than the purchase price');
  }), 
  //  discount: Yup.number().min(0, 'Discount must be at least 0').max(100, 'Discount must not exceed 100').required('Discount is required'),
  tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
  total: Yup.number(),
  tax_amount: Yup.number(),
  total_inc_tax: Yup.number(),
  hsn:Yup.number()
  });
  

  const purchaseValidationSchema = Yup.object({
    purchase_date: Yup.date().required('Purchase date is required'),
    purchase_number: Yup.number(),
    supplier_id: Yup.string().required('Supplier is required'),
    payment_status: Yup.string().required('Payment status option is required'),
    paid_amount: Yup.number()
      .when('payment_status', (payment_status, schema) =>
        ['advance', 'credit'].includes(payment_status)
          ? schema.required('Paid amount is required').min(0)
          : schema.notRequired()
      ),
    payment_balance: Yup.number(),
    payment_due_date: Yup.date().nullable(), // No need for Yup.string()
    notes: Yup.string(),
    purchase_items: Yup.array()
      .of(itemSchema) // Ensure itemSchema is defined
      .min(1, 'At least one item is required'),
    total_exclude_tax: Yup.number(),
    grand_total: Yup.number(),
    discount: Yup.number().min(0.01, 'Discount must be at least 1%').max(1, 'Discount must not exceed 100%'),
    tax_amount: Yup.number(),
    purchase_order_id: Yup.string(),
    invoice_number: Yup.string().required('Please add Invoice Number'),
    payment_mode: Yup.string().required('Please select payment mode'),
    account_id: Yup.string()
      .when('payment_mode', (payment_mode, schema) =>
        payment_mode === 'bank' ? schema.required('Mode of transaction is required') : schema.notRequired()
      ),
    reference_number: Yup.number()
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
  
 

const AddPurchase = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
 const [items, setItems] = useState([]);
 const [total, setTotal] = useState(0);
 const [grandTotal, setGrandTotal] = useState(0);
 const [taxAmount,setTaxAmount] = useState(0)
 const [customErrMsg,setCustomErrMsg] = useState('')
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      purchase_date: new Date(),
      purchase_number: '',
      supplier_id: '',
      payment_status: '',
      paid_amount: '',
      payment_balance: '',
      payment_due_date: '',
      discount: '',
      account_id: '',
      payment_mode: '',
      purchase_items: [],
      notes: '',
      total_exclude_tax: '',
      grand_total: '0',
      tax_amount: '',
      purchase_order_id: '',
      invoice_number: '',
      reference_number: '',
      reference_date: '',
    },
    validationSchema: purchaseValidationSchema,
    onSubmit: (values) => {
      values.purchase_items = items;
  
      let errors = {};
      if (!values?.purchase_items?.length) {
        errors.purchase_items = 'At least one item is required';
      }
      if (values.payment_mode === 'bank' && !values.account_id) {
        errors.account_id = 'Account Id is Required';
      }
      if (['rtgs', 'cheque'].includes(values.payment_mode)) {
        if (!values.reference_number) {
          errors.reference_number = 'Reference Number Is Required';
        }
        if (!values.reference_date) {
          errors.reference_date = 'Reference Date Is Required';
        }
      }
      if (['advance', 'credit'].includes(values.payment_status)) {
        if (!values.paid_amount) {
          errors.paid_amount = 'Paid amount is required';
        }
        if (!values.payment_due_date) {
          errors.payment_due_date = 'Last date is required';
        }
      }
      if (Object.keys(errors).length > 0) {
        formik.setErrors(errors);
        return;
      }
  
      // Format dates before submission
      const formattedValues = {
        ...values,
        purchase_date: format(values.purchase_date, 'yyyy-MM-dd'),
        payment_due_date: values.payment_due_date ? format(values.payment_due_date, 'yyyy-MM-dd') : null,
        reference_date: values.reference_date ? format(new Date(values.reference_date), 'yyyy-MM-dd') : null,
      };
  
      console.log('Final Submission:', formattedValues);
      const promise = dispatch(createPurchase(formattedValues));
      promise.then((res) => {
        console.log(res, "checking the res");
        toast.success(res.payload.success);
        if (res.payload.error){
          toast.error(res.payload.error)
        }
        setTimeout(() => {
          navigate('/purchase/');
        }, 1000);
      });
    },
  });
  
useEffect
  const dispatch = useDispatch()
    const { suppliers,products,purchaseOrders,paymentModes, loading, error } = useSelector((state) => state?.purchases);
    const matchingPurchaseOrder = purchaseOrders?.find((po) => formik.values.purchase_order_id == po.id);

    useEffect(() => {
      const newTotal = items?.reduce((acc, item) => {
        const itemTotal = (item?.quantity * item?.price) || 0;
        return acc + itemTotal;
      }, 0);
    
      const totalTax = items?.reduce((acc, item) => {
        const itemTaxAmount = parseInt(item?.tax_amount) || 0;
        return acc + itemTaxAmount;
      }, 0);
    
      const newGrandTotal = (newTotal - (newTotal * (formik.values.discount || 0) / 100) + totalTax) || 0 ;
      const newPaymentBalance = newGrandTotal - (formik.values.paid_amount || 0);
    
      setTaxAmount(totalTax);
      setTotal(newTotal);
      setGrandTotal(newGrandTotal);
    
      // Update Formik's field values
      formik.setFieldValue('total_exclude_tax', newTotal?.toFixed(2));
      formik.setFieldValue('grand_total', newGrandTotal?.toFixed(2));
      formik.setFieldValue('payment_balance', newPaymentBalance.toFixed(2));
      formik.setFieldValue('tax_amount', totalTax);
      formik.setFieldValue('purchase_items', items);
    }, [items, formik.values.discount, formik.values.paid_amount]);
    


   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items?.filter((_, i) => i !== index);
    setItems(newItems);
  };



  useEffect(() => {
    const filter = matchingPurchaseOrder?.purchase_order_items.map((item)=>{
      const selectedProduct = products.find(product => product.id == item?.product_id); 
      console.log(selectedProduct,"selected products",item)
      return {...item, hsn: selectedProduct?.hsn_code,tax:selectedProduct?.tax_rate}
      })
      console.log(filter,"First filter")
   const secondfilter =   filter?.map((item)=>{
        const quantity = item.quantity
        const price = item.price
        const tax = item.tax
        const total = quantity * price;
        const taxAmount = total * tax / 100;
        const totalInclTax = total + taxAmount;
        
        return {...item, total : total.toFixed(2) ,tax_amount : taxAmount.toFixed(2) ,total_inc_tax : totalInclTax.toFixed(2)}
      })
      console.log(secondfilter,"sec0ond filter")

    setItems(secondfilter)
    console.log("testing useeffedct")
    formik.setFieldTouched('purchase_items', items);

  }, [formik.values.purchase_order_id, purchaseOrders]);
  // useEffect(()=> {
  //     formik.setFieldValue('purchase_items', items); 
  //     formik.setFieldValue('total_exclude_tax', total?.toFixed(2));
  // },[])

useEffect(() => {
  dispatch(setHeading("Purchase Bill"));
  return () => {
    dispatch(clearHeading());
  };
}, [dispatch]);

const handleEditItem = (index,itemsId) => {
  const item = items?.find(data => data.id === itemsId)
  dispatch(editPurchaseColumn({data:item,index:index}))
  setShowEditModal(true)
 }


const importPurchaseOrder = () =>{
  setCustomErrMsg('')
  if(formik.values.purchase_order_number?.length == 11){
    console.log("inside function",purchaseOrders)
      const ReferensePurchase =    purchaseOrders?.find(item => (item.purchase_order_number == formik.values.purchase_order_number
              ))
              console.log(ReferensePurchase,"its the referense purchase")
              if(ReferensePurchase == undefined){
                console.log("inside undefined")
              return  setCustomErrMsg("Cannot find Purchase Order")
              }else{

              return   formik.setFieldValue('purchase_order_id',ReferensePurchase.id)
              }
            }else{
             return setCustomErrMsg("Purchase Order Number format is Wrong")
            }
}

console.log(formik.errors,"hello",formik.values)

  return (
    <div className="bg-white  p-5">
      <h2 className="text-xl font-medium mb-5 text-center">Purchase Bill </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2">
        <div className="flex w-full gap-4">
        <div className='w-full'>
        <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">Venodr :</label>
        <select
            id="supplier_id"
            {...formik.getFieldProps('supplier_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">Select Vendor</option>
            {suppliers?.map(item => (
                <option key={item.id} value={item.id}>{item.first_name}</option>
            ))}
        </select>
        {formik.touched.supplier_id && formik.errors.supplier_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.supplier_id}</p>
        )}
    </div>
    <div className='w-full'>
        <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700">Invoice Number:</label>
        <input
          id="invoice_number"
          type="text"
          {...formik.getFieldProps('invoice_number')}
          className="mt-1 block w-full px-4 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         {formik.touched.invoice_number && formik.errors.invoice_number && (
            <p className="text-red-500 text-xs italic">{formik.errors.invoice_number}</p>
        )}
      </div>
        </div>
        <div className="flex justify-end">

        <div>
            <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">Date:</label>
            <DatePicker
                selected={formik.values.purchase_date}
                onChange={(date) => formik.setFieldValue('purchase_date', date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.purchase_date && formik.errors.purchase_date && (
                <p className="text-red-500 text-xs italic">{formik.errors.purchase_date}</p>
            )}
        </div>

        <div className='hidden'>
            <label htmlFor="purchase_number" className="block text-sm font-medium text-gray-700">Purchase ID:</label>
            <input
                id="purchase_number"
                type="text"
                {...formik.getFieldProps('purchase_number')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.purchase_number && formik.errors.purchase_number && (
                <p className="text-red-500 text-xs italic">{formik.errors.purchase_number}</p>
            )}
        </div>
      
        </div>
    </div>



    <div className='grid grid-cols-3'>
      <div className="">

        <label htmlFor="purchase_order_number" className="block text-sm font-medium text-gray-700">Purchase Order :</label>
        <div className="flex">
        <input
          id="purchase_order_number"
          type="text"
          {...formik.getFieldProps('purchase_order_number')}
          className="mt-1 block w-full px-4 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div className="  text-center flex items-center ml-2" >

                  <div onClick={()=>importPurchaseOrder()} className="flex items-center  bg-blue-600 p-2 rounded-md leading-none text-center cursor-pointer   "><LuImport className='text-white text-center ' /></div>
        </div>
        </div>
                <div className="text-red-700 text-sm ">{customErrMsg}</div>
      </div>
      <div className="hidden">
        <select
            id="purchase_order_id"
            
            {...formik.getFieldProps('purchase_order_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">Select Purchase Order</option>
            {purchaseOrders?.map(item => (
                <option key={item.id} value={item.id}>{item.purchase_order_number}</option>
            ))}
        </select>
        {formik.touched.purchase_order_id && formik.errors.purchase_order_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.purchase_order_id}</p>
        )}

      </div>
    </div>



     
     

     

      {/* Items Table */}
        <div className="mt-10">
          <div className="mt-4">
<div className="mb-2 flex justify-end">
   <button type="button" onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-medium leading-none py-2 px-4 rounded">
          Add Products
        </button>
</div>
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">physical</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exbound</th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Incl Tax</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              {items?.length > 0 && (

              <tbody className="bg-white divide-y divide-gray-200">
                {items?.map((item, index) => (
                  <tr key={index}>
<td className="px-6  whitespace-nowrap text-sm text-gray-500">
  {
    products?.find(pro => pro.id == item?.product_id)?.product_name || item?.product_id
  }
</td>

                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.hsn}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.tax || 0}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.quantity}</td>
                    {/* <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.inbound || 0} </td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.outbound || 0}</td> */}
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.price}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.total}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.discount  || 0}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.tax_amount || 0}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.total_inc_tax ||0}</td>
                    <td className="px-6  whitespace-nowrap flex items-center gap-4 justify-center text-right text-sm font-medium">
                      <div className="flex items-center ">
                      <button onClick={() => handleEditItem(index,item.id)} className="text-primary-600 hover:text-red-900">
                      <CiEdit className='mt-5 w-6 h-5' /> &nbsp; &nbsp;
                      </button></div>
                      <button onClick={() => handleDeleteItem(index)} className="text-red-600 hover:text-red-900">
                      <AiOutlineDelete className='w-5 h-5' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
          )}
            </table>
          <div className="flex justify-center items-center py-2">
{formik.touched.purchase_items && formik.errors.purchase_items && (
    <p className="text-red-500 text-sm ">{formik.errors.purchase_items}</p>)}
            </div>  

          </div>
        </div>
            <div className="flex gap-4 justify-end mt-5">
  {/* Total Display */}
   <div>
        <label htmlFor="total_exclude_tax" className="block text-sm font-medium text-gray-700">Total Exclude Tax:</label>
        <input
          id="total_exclude_tax"
          type="text"
          {...formik.getFieldProps('total_exclude_tax')}
          disabled // This field is disabled and cannot be edited by the user
          className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>


  {/* Grand Total TAx */}
  <div>
    <label htmlFor="tax_amount" className="block text-sm font-medium text-gray-700"> Total Tax:</label>
    <input
      id="tax_amount"
      type="text"
      value={taxAmount}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
  {/* Discount Input */}
  <div>
    <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%):</label>
    <input
      id="discount"
      {...formik.getFieldProps('discount')}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
  {/* Grand Total Display */}
  <div>
    <label htmlFor="grandTotal" className="block text-sm font-medium text-gray-700">Grand Total:</label>
    <input
      id="grandTotal"
      type="text"
      value={grandTotal?.toFixed(2)}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</div>

     <div className="grid grid-cols-4 gap-3 mt-10">
       {/* payment_status Method */}
       <div className="">
       <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Payment Status:</label>

       <select
        id="payment_status"
        {...formik.getFieldProps('payment_status')}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select payment Status </option>
        <option value="full">Full</option>
        <option value="advance">advance</option>
        <option value="credit">credit</option>
      </select>
      {formik.touched.payment_status && formik.errors.payment_status && (
        <div className="text-sm text-red-600">{formik.errors.payment_status}</div>
      )}
       </div>

      {/* Paid Amount - Conditional */}
      {formik.values.payment_status === 'advance' || formik.values.payment_status === 'credit' ? (
        <>
        <div className="">
        <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Paid Amount</label>
          <input
            type="number"
            {...formik.getFieldProps('paid_amount')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Paid Amount"
          />
          {formik.touched.paid_amount && formik.errors.paid_amount && (
            <div className="text-sm text-red-600">{formik.errors.paid_amount}</div>
          )}

        </div>
          {/* Balance Amount - Automatically calculated, shown when relevant */}
          <div className="">
          <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Balance Amount:</label>
          <input
            type="text"
            {...formik.getFieldProps('payment_balance')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm"
            placeholder="Balance Amount"
          />

          </div>

          {/* Last Date - Conditional */}
          <div className="">
          <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Due Date:</label>

          <DatePicker
            selected={formik.values.payment_due_date}
            onChange={date => formik.setFieldValue('payment_due_date', date)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.payment_due_date && formik.errors.payment_due_date && (
            <div className="text-sm text-red-600">{formik.errors.payment_due_date}</div>
          )}
          </div>
        </>
      ) : null}
</div>
<div className="grid grid-cols-4 gap-3 mt-10">

            <div>
          <label htmlFor="payment_mode" className="block text-sm font-medium text-gray-700">Payment Mode:</label>
          <select
  id="payment_mode"
  {...formik.getFieldProps('payment_mode')}
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value="">Select Transaction method</option>
  <option value="bank">Bank</option>
  <option value="cheque">Cheque</option>
  <option value="rtgs">RTGS</option>
  <option value="neft">NEFT</option>
  <option value="cash">Cash</option>
</select>

          {formik.touched.payment_mode && formik.errors.payment_mode && (
            <div className="text-sm text-red-600">{formik.errors.payment_mode}</div>
          )}
        </div>
        {formik.values.payment_mode == "bank" &&          <div>
          <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Account:</label>
          <select
  id="account_id"
  {...formik.getFieldProps('account_id')}
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value="">Select Bank Account</option>
  {paymentModes.map((item) => (
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
        <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">Reference Number</label>
          <input
            type="number"
            {...formik.getFieldProps('reference_number')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Reference Number"
          />
          {formik.touched.reference_number && formik.errors.reference_number && (
            <div className="text-sm text-red-600">{formik.errors.reference_number}</div>
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
     </div>
          <div className='my-6'>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes:</label>
          <textarea
            id="notes"
            {...formik.getFieldProps('notes')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add any relevant notes here..."
          />
        </div>
        <div className="flex justify-center my-4"><button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium leading-none py-2 px-4 rounded">
          Submit Purchase
        </button></div>
        </form>
         {/* Modal for adding items */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Products to Purchase"
        content={<AddItemsForm items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
        <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Items to Purchase"  
        id={"Add-Purchase-column"}
        content={<EditItemsForm items={items} setItems={setItems} onClose={() => setShowEditModal(false)} />}
      />
    </div>
  );
};

export default AddPurchase;

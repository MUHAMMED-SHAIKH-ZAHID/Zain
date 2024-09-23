import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import {  editPurchaseColumn, updatePurchase } from '../../../../redux/features/PurchaseSlice';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';



const itemSchema = Yup.object().shape({
  product_id: Yup.string().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  // inbound: Yup.number().min(0, 'physical must be at least 0'),
  // outbound: Yup.number().min(0, 'transist must be at least 0'),
  price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
  tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
  total: Yup.number(),
  tax_amount: Yup.number(),
  total_inc_tax: Yup.number(),
  });
  

  const purchaseValidationSchema = Yup.object({
    purchase_date: Yup.date().required('Purchase date is required'),
    purchase_number: Yup.number(),
    supplier_id: Yup.string().required('Vendor is required'),
    payment_status: Yup.string().required('Payment status option is required'),
    paid_amount: Yup.number()
      .when('payment_status', (payment_status, schema) =>
        [ 'partial'].includes(payment_status)
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
    discount: Yup.number().min(0, 'Discount must be at least 1%').max(1, 'Discount must not exceed 100%'),
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
    bank_name: Yup.string()
      .when('payment_mode', (payment_mode, schema) =>
        ['cheque', 'rtgs', 'neft'].includes(payment_mode)
          ? schema.required('Please select Reference Date')
          : schema.notRequired()
      ),
  });
  


const PrintPurchase = () => {
  const { suppliers,printpurchasedata,purchaseOrders,products,paymentModes, loading, error } = useSelector((state) => state?.purchases);
  const dispatch = useDispatch()
  const navigate = useNavigate()
 const [customErrMsg,setCustomErrMsg] = useState('')
 const [total, setTotal] = useState(0);
 const [grandTotal, setGrandTotal] = useState(0);
 const [taxAmount,setTaxAmount] = useState(0)
 const [items, setItems] = useState(printpurchasedata?.purchase_items);
    // const { suppliers,products,purchaseOrders,paymentModes, loading, error } = useSelector((state) => state?.purchases);
    
    const formik = useFormik({
      initialValues: {
        purchase_date: printpurchasedata?.purchase_date,
        purchase_number: printpurchasedata?.purchase_number,
        supplier_id: printpurchasedata?.supplier_id,
        payment_status: printpurchasedata?.payment_status,
        paid_amount: printpurchasedata?.paid_amount,
        payment_balance: printpurchasedata?.payment_balance,
        payment_due_date: printpurchasedata?.payment_due_date,
        discount: printpurchasedata?.discount || 0,
        payment_mode: printpurchasedata?.payment_mode,
        account_id: printpurchasedata?.account_id,
        reference_number: printpurchasedata?.reference_number,
        reference_date: printpurchasedata?.reference_date,
        purchase_items: printpurchasedata?.purchase_items || [],
        notes: printpurchasedata?.notes || '',
        total: printpurchasedata?.total,
        grand_total: printpurchasedata?.grand_total,
        tax_amount: printpurchasedata?.tax_amount,
        purchase_order_id: printpurchasedata?.purchase_order_id || '',
        invoice_number: printpurchasedata?.invoice_number,
        bank_name:printpurchasedata?.bank_name || '',
      },
      validationSchema: purchaseValidationSchema,
      onSubmit: async (values) => {
        try {
          // Format the dates before submitting
          const formattedValues = {
            ...values,
            purchase_date: format(new Date(values.purchase_date), 'yyyy-MM-dd'),
            payment_due_date: format(new Date(values.payment_due_date), 'yyyy-MM-dd'),
            reference_date: format(new Date(values.reference_date), 'yyyy-MM-dd'),
          };
          
          // Log the final submission values
  
          // Dispatch the updatePurchase action
          const promise = dispatch(updatePurchase({ id: printpurchasedata.id, purchaseData: formattedValues }));
          
          promise.then((res) => {
            toast.success(res.payload.success);
            if (res.payload.error) {
              toast.error(res.payload.error);
            }
            setTimeout(() => {
              navigate('/purchase/');
            }, 1000);
          });
        } catch (error) {
          console.error('Error updating purchase:', error);
          // Handle general error (e.g., display error message)
        }
      },
      enableReinitialize: true,
    });
  


  useEffect
    const matchingPurchaseOrder = purchaseOrders?.find((po) => formik.values.purchase_order_id == po.id);

    useEffect(() => {
      const newTotal = items?.reduce((acc, item) => {
        const itemTotal = (parseFloat(item?.quantity) * parseFloat(item?.price)) || 0;
        return acc + itemTotal;
      }, 0);
      
      const totalTax = items?.reduce((acc, item) => {
        const itemTaxAmount = parseFloat(item?.tax_amount) || 0;
        return acc + itemTaxAmount;
      }, 0);
       const updatedTotal = newTotal+totalTax
      const newGrandTotal = (updatedTotal - (updatedTotal * (parseFloat(formik.values.discount)  || 0) / 100) ) || 0;
      const newPaymentBalance = newGrandTotal - (parseFloat(formik.values.paid_amount) || 0);
      
      setTaxAmount(totalTax);
      setTotal(newTotal);
      setGrandTotal(newGrandTotal);
      
      // Update Formik's field values
      formik.setFieldValue('total_exclude_tax', newTotal?.toFixed(2));
      // formik.setFieldValue('grand_total', newGrandTotal?.toFixed(2));
      formik.setFieldValue('payment_balance', newPaymentBalance.toFixed(2));
      formik.setFieldValue('tax_amount', totalTax?.toFixed(2));
      formik.setFieldValue('purchase_items', items);
    }, [items, formik.values.discount, formik.values.paid_amount]);
    


   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items?.filter((_, i) => i !== index);
    setItems(newItems);
  };









    
const componentRef = useRef();


  return (
    <div ref={componentRef} className="bg-white  p-5">
    <h2 className="text-xl font-medium mb-5 text-center"> Purchase Bill </h2>
    <div className="grid grid-cols-[2fr,3fr,1fr] border text-[.9rem] border-b-0">
      <div className="">
      <div className="grid grid-cols-[2fr,6fr] p-1" >
        <div className="gap-1 grid ">
          <div className="uppercase">Regt Name</div>
          <div className="uppercase">ADD</div>
          <div className="uppercase">pin</div>
          <div className="uppercase">State Code</div>
          <div className="uppercase">GST</div>
          <div className="uppercase">CIN</div>


        </div>
        <div className="grid gap-1 pl-10 ">
        
          <div className="uppercase">Gnidertron Private Limited</div>
          <div className="justify-start flex">No. 57/1003-C ,Near Abu Haji Hall</div>
          <div className="uppercase justify-start flex">673003</div>
          <div className="uppercase justify-start flex">32</div>
          <div className="uppercase">32aalcg2360h1zt</div>
          <div className="uppercase">U46490KL2024PTC087587</div>
        </div>
      </div>

        <div className="border w-full">
        <div className="grid grid-cols-[2fr,6fr] p-1" >
        <div className="gap-1 grid ">
          <div className="uppercase">BILL.NO</div>
          <div className="uppercase"></div>
        </div>
        <div className="grid gap-1 pl-10 ">
        
          <div className="justify-start flex">{printpurchasedata?.bill_number}</div>
          <div className="uppercase">&nbsp;</div>
        </div>
      </div>
        </div>
      </div>
      <div className="">
      <div className="grid border-l pl-2 p-1 grid-cols-[2fr,6fr]" >
        <div className="gap-1 grid ">
          <div className="uppercase">Vendor Name</div>
          <div className="uppercase">ADD</div>
          <div className="uppercase">pin</div>
          <div className="uppercase">State Code</div>
          <div className="uppercase">GST</div>
          <div className="uppercase">Pan</div>
        </div>
        <div className="grid gap-1 pl-10">
        
          <div className="uppercase">{printpurchasedata?.supplier_name}</div>
          <div className="justify-start flex">{printpurchasedata?.supplier_address}</div>
          <div className="justify-start flex">{printpurchasedata?.pin}</div>
          <div className="justify-start flex">{printpurchasedata?.gst_number?.slice(0,2)}</div>
          <div className="justify-start flex">{printpurchasedata?.gst_number}</div>
          <div className="justify-start flex">{printpurchasedata?.pan_number}</div>
   
        </div>
      
      </div>   
      <div className="border w-full">
        <div className="grid grid-cols-[2fr,6fr] p-1" >
        <div className="gap-1 grid ">
          <div className="uppercase">Route</div>
          <div className="uppercase">DL.NO</div>
        </div>
        <div className="grid gap-1 pl-10 border-l ">
        
          <div className="uppercase"></div>
          <div className="justify-start flex"></div>
        </div>
      </div>
        </div>
      </div>
         <div className="border">
        <div className="font-medium pt-2 text-center">INV.NO</div>
        <div className="font-normal pt-1 text-center uppercase">{printpurchasedata?.invoice_number}</div>
        <div className="border flex justify-between">
          <div className="p-1">DATE</div>
          <div className="text-start flex p-1">&nbsp; : &nbsp;{printpurchasedata?.purchase_date}</div>
        </div>
      </div>
    </div>

    <form onSubmit={formik.handleSubmit} className="space-y-4">

    {/* Items Table */}
    <div className="border ">
        <div className="">
<div className=" flex justify-end">

</div>
          <table className="min-w-full divide-y divide-gray-200 ">
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

                  <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-500">{item?.hsn}</td>
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.tax || 0}</td>
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.quantity}</td>
                  {/* <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.inbound || 0} </td>
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.outbound || 0}</td> */}
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.price}</td>
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.total}</td>
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.discount  || 0}</td>
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.tax_amount || 0}</td>
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.total_inc_tax ||0}</td>
                </tr>
              ))}
            </tbody>
        )}
          </table>
          
{formik.touched.purchase_items && formik.errors.purchase_items && (
  <p className="text-red-500 text-sm ">{formik.errors.purchase_items}</p>)}

        </div>
      </div>
      <div className="flex gap-4 justify-end mt-5 mr-5">
{/* Total Display */}
 <div className='grid gap-2'>
      <label htmlFor="total_exclude_tax" className="block text-md font-medium ">Total Exclude Tax</label>
      <label htmlFor="tax_amount" className="block text-md font-medium text-gray-700"> Total Tax</label>
      <label htmlFor="discount" className="block text-md font-medium text-gray-700">Discount </label>
      <label htmlFor="grandTotal" className="block text-md font-medium text-gray-700">Grand Total</label>
    </div>


{/* Grand Total TAx */}
<div className='grid'>
  <div className="">
      :₹ {formik?.values?.total_exclude_tax}
  </div>
  <div className="">

  :₹ {printpurchasedata?.tax_amount}
  </div>
  <div className="">
  : {formik?.values?.discount} %
  </div>
  <div className="">
  :₹ {printpurchasedata?.grand_total}
  </div>
</div>
{/* Discount Input */}

</div>

<table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                {formik.values.payment_status === 'partial' ? (
      <>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th></>):<></>}

                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                {formik.values.payment_mode === 'cheque' || formik.values.payment_mode === 'rtgs' || formik.values.payment_mode === 'neft' ? (
      <>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referense Number</th>

                      </>):<></>}
                      {formik.values.payment_mode == "bank" &&  
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th> }
              </tr>
            </thead>
            {items?.length > 0 && (

            <tbody className="bg-white divide-y divide-gray-200">
            
                <tr className='border uppercase'>


                  <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-500">{formik.values.payment_status}</td>
                  {formik.values.payment_status === 'partial' ? (
      <>
                  <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-500">{formik.values.paid_amount}</td></>):<></>}
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{formik.values.payment_balance}</td>
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{formik.values.payment_due_date}</td>
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{formik.values.payment_mode}</td>
                  {formik.values.payment_mode === 'cheque' || formik.values.payment_mode === 'rtgs' || formik.values.payment_mode === 'neft' ? (
      <>
                                      <td className="px-6  whitespace-nowrap text-sm text-gray-500">{formik.values.reference_number}</td>


                      </>):<></>}
                  {formik.values.payment_mode === 'cheque' || formik.values.payment_mode === 'rtgs' || formik.values.payment_mode === 'neft' ? (
      <>
                                      <td className="px-6  whitespace-nowrap text-sm text-gray-500">{formik.values.reference_number}</td>


                      </>):<></>}
                      {formik.values.payment_mode == "bank" &&  
                  <td className="px-6  whitespace-nowrap text-sm text-gray-500">{paymentModes?.find(item => item.id == formik.values.account_id)?.account_name}</td>}

                </tr>
          
            </tbody>
        )}
          </table>
          {formik.values.notes &&
      
      <div className='my-6'>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 underline">Notes</label>
      <div className="">{formik?.values?.notes}</div>
      </div>
      }
      </form>
  
  </div>
  );
};

export default PrintPurchase;

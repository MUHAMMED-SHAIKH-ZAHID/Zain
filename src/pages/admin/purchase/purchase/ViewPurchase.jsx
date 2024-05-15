import { useEffect, useState,useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import AddItemsForm from '../purchase/createpurchase/AddItemsForm';
import { convertPurchase, updatePurchasequotation } from '../../../../redux/features/PurchaseQuotationSlice';
import Modal from '../../../../components/commoncomponents/Modal';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';




  

const itemSchema = Yup.object().shape({
    product_id: Yup.string().required('Product is required'),
    quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
    price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
    tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
    total: Yup.number(),
    tax_amount: Yup.number(),
    total_inc_tax: Yup.number(),
    purchase_order_id:Yup.number(),
    id:Yup.number(),
    createdat:Yup.number(),
    updatedat:Yup.number(),
    });
    
  
  const purchaseValidationSchema = Yup.object({
      purchase_order_date: Yup.date().required('Purchase date is required'),
      supplier_id: Yup.string().required('Supplier is required'),
      notes: Yup.string(),
      purchase_items: Yup.array()
      .of(itemSchema).min(1, 'At least one item is required'),
      total_exclude_tax:Yup.number(),
      grand_total:Yup.number(),
      tax_amount:Yup.number(),
  });

const ViewPurchase = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    // const { suppliers,viewpurchase,products, loading, error } = useSelector((state) => state?.purchaseQuotation);
    const { suppliers,viewpurchasedata,paymentModes,products, loading, error } = useSelector((state) => state?.purchases);
     console.log(suppliers,"suppliers list");
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState(viewpurchasedata?.purchase_items || []);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)
    const [showPrint,setShowPrint] = useState(true)

  

    console.log(viewpurchasedata,suppliers,"checking viewpurchasedataid",viewpurchasedata?.id)
    
    
    const componentRef = useRef();

    const handlePrintfun = () => {
        setShowPrint(false); // Hide elements
        setTimeout(() => {
          handlePrint(); // Trigger print operation
          setTimeout(() => {
            setShowPrint(true); // Restore visibility after printing
          }, 100); // You might adjust this timeout based on your needs
        }, 0);
      };
      
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      onBeforePrint: () => setShowPrint(false),
      onAfterPrint: () =>  setShowPrint(true),
    });
    
    const formik = useFormik({
        initialValues: {
            purchase_order_date: viewpurchasedata?.purchase_order_date,
            supplier_id: viewpurchasedata?.supplier_id,
            purchase_items:viewpurchasedata?.purchase_items,
            purchase_order_number:viewpurchasedata?.purchase_order_number,
            notes: viewpurchasedata?.notes,
            total_exclude_tax:viewpurchasedata?.total_exclude_tax,
            grand_total:viewpurchasedata?.grand_total,
            tax_amount:viewpurchasedata?.tax_amount,
            payment_status: viewpurchasedata?.payment_status,
            paid_amount: viewpurchasedata?.paid_amount,
            payment_balance: viewpurchasedata?.payment_balance,
            payment_due_date:viewpurchasedata?.payment_due_date,
            account_id:viewpurchasedata?.account_id,
        },
        validationSchema: purchaseValidationSchema,
        onSubmit: (values) => {
            console.log("testing");
            console.log('Final Submission:', values);
            dispatch(convertPurchase(values))
            navigate('/purchase/quotation/convert')
            // dispatch(updatePurchasequotation({ id: viewpurchasedata.id, purchaseData: values }))

        },
        enableReinitialize: true,  // This is crucial for reinitializing the form when viewpurchasedata changes

    });
    console.log(items,"it is to chaeck the items is available or not")
    useEffect(() => {
        const newTotal = items?.reduce((acc, item) => acc + (item.quantity * item.price ), 0);
        const totalTax = items?.reduce((acc,item) => acc + parseInt(item.tax_amount) , 0)
        const newGrandTotal = newTotal  - totalTax
        const newpayment_balance = newGrandTotal - formik.values.paid_amount;
        console.log(totalTax,"it is the total taxes",items)
        setTaxAmount(totalTax)
        setTotal(newTotal);
        setGrandTotal(newGrandTotal);
        console.log(newGrandTotal,"shshshsshshshshsh")
    
        // Update Formik's field values
        formik.setFieldValue('total_exclude_tax', newTotal.toFixed(2));
        formik.setFieldValue('grand_total', newGrandTotal);
        formik.setFieldValue('payment_balance', newpayment_balance.toFixed(2));
        formik.setFieldValue('tax_amount', totalTax.toFixed(2));
    }, [items, formik.values.discount, formik.values.paid_amount]);


//    // Function to remove an item from the list
//    const handleDeleteItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//   };

useEffect(() => {
  dispatch(setHeading("Purchase"));

  // Optionally reset the heading when the component unmounts
  return () => {
    dispatch(clearHeading());
  };
}, [dispatch]);



  return (
    <div ref={componentRef} className="   mx-6 m-5 border drop-shadow-sm">
  <div className="grid grid-cols-2 w-full p-5">
            <div className="">
     

           <div className="">
            <div className="text-lg font-semibold my-1 mt-2"> Bill to:</div>
            <div className="text-md font-semibold">{viewpurchasedata?.supplier_name}</div>
            <div className="">{viewpurchasedata?.supplier_email}</div>
            <div className="">{viewpurchasedata?.supplier_address}</div>
            <div className="">{viewpurchasedata?.supplier?.gst_number}83494 48499 </div>
            </div>
            </div>
            <div className="grid justify-items-end">
                <div className="">

<div className="text-md font-semibold"> Zain Sale Corp</div>
<div className="">address address address</div>
<div className="">pincode state</div>
<div className="">zain@gmail.com</div>
<div className="">+91 9999999999</div>
                </div>
                <div className="">

             <div className="grid justify-items-end pt-5">
                <div className="grid grid-cols-2">
           

             <div className='gap-5'>
            <div htmlFor="purchase_order_date" className="block text-sm font-medium text-black">Invoice Number:</div>
            <div htmlFor="purchase_order_date" className="block text-sm font-medium text-black">Invoice Date:</div>
        </div>
             <div className=' gap-5'>
           <div className="block text-[.8rem] font-medium text-gray-500">{viewpurchasedata?.purchase_number}</div>
           <div className="block text-[.8rem] font-medium text-gray-500">{viewpurchasedata?.purchase_date}</div>
        </div>
                </div>
                </div>
             </div>
            </div>
        </div>      
      <form onSubmit={formik.handleSubmit} className="space-y-4 ">
      <div className="flex justify-between">
      

    </div>

  


{/* 
        <button type="button" onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Products
        </button>
      */}
     

     

       {/* Items Table */}
       {items?.length > 0 && (
        <div className="mt-6">
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Incl Tax</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items?.map((item, index) => (
                  <tr key={index}>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {
    products.find(pro => pro.id == item.product_id)?.product_name || item.product_id
  }
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_inc_tax}</td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
            

          </div>
        </div>
      )}
            <div className="grid gap-2 justify-end mt-5">
  {/* Total Display */}
   <div className='flex justify-between items-center gap-10 mx-2'>
    <div className="">

        <label htmlFor="total_exclude_tax" className="block text-sm font-medium text-gray-700">Total Exclude Tax:</label>
    </div>
    <div className="">

        <input
          id="total_exclude_tax"
          type="text"
          {...formik.getFieldProps('total_exclude_tax')}
          disabled // This field is disabled and cannot be edited by the user
          className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
      </div>
      {/* Grand Total TAx */}
      <div className='flex justify-between items-center gap-10 mx-2'>
        <div className="">
        <label htmlFor="tax_amount" className="block text-sm font-medium text-gray-700"> Total Tax:</label>

        </div>
        <div className="">
        <input
      id="tax_amount"
      type="text"
      value={taxAmount}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
        </div>
      </div>




  {/* Grand Total Display */}
  <div className='flex justify-between items-center gap-10 mx-2'>
    <div className="">
    <label htmlFor="grandTotal" className="block text-sm font-medium text-gray-700">Grand Total:</label>

    </div>
    <div className="">
    <input
      id="grandTotal"
     {...formik.getFieldProps('grand_total')}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    </div>
  </div>
 
</div>

<div className="grid grid-cols-3 gap-3 mt-10 p-2">
       {/* payment_status Method */}
       <div className="">
       <label htmlFor="transaction_mode" className="block text-sm font-medium text-gray-700">payment_status Option:</label>

       <select
        id="payment_status"
        disabled
        {...formik.getFieldProps('payment_status')}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select payment_status Method</option>
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
        <label htmlFor="transaction_mode" className="block text-sm font-medium text-gray-700">Paid Amount</label>
          <input
          disabled
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
          <label htmlFor="transaction_mode" className="block text-sm font-medium text-gray-700">Balance Amount:</label>
          <input
          disabled
            type="text"
            {...formik.getFieldProps('payment_balance')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm"
            placeholder="Balance Amount"
          />

          </div>

          {/* Last Date - Conditional */}
          <div className="">
          <label htmlFor="transaction_mode" className="block text-sm font-medium text-gray-700">Due Date:</label>

          <DatePicker
            selected={formik.values.payment_due_date}
            disabled
            onChange={date => formik.setFieldValue('payment_due_date', date)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.payment_due_date && formik.errors.payment_due_date && (
            <div className="text-sm text-red-600">{formik.errors.payment_due_date}</div>
          )}
          </div>
        </>
      ) : null}
            <div>
          <label htmlFor="transaction_mode" className="block text-sm font-medium text-gray-700">Mode of Transaction:</label>
          <select
            id="transaction_mode"
            {...formik.getFieldProps('account_id')}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value =''>select Transaction method</option>
            {paymentModes?.map((item) => (
        <option key={item.id} value={item.id}>{item.account_name}</option>
    ))}
          </select>
          {formik.touched.transaction_mode && formik.errors.transaction_mode && (
            <div className="text-sm text-red-600">{formik.errors.transaction_mode}</div>
          )}
        </div>
      
     </div>

   
          <div className='my-6 p-2'>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes:</label>
          <textarea
          disabled
            id="notes"
            {...formik.getFieldProps('notes')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add any relevant notes here..."
          />
        </div>
        {showPrint && (

        <div className="flex justify-center my-4 pb-10">   <button onClick={handlePrintfun} type="submit" className="bg-zinc-800 hover:bg-black text-white font-bold py-2 px-4 rounded">
          Print Pdf
        </button>
      
        </div>
        )
        }
        </form>
         {/* Modal for adding items */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Products to Purchase"
        content={<AddItemsForm  items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
    </div>
  );
};

export default ViewPurchase;

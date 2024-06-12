import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { CiEdit } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import Modal from '../../../../components/commoncomponents/Modal';
import { editPurchaseColumn, updatePurchase } from '../../../../redux/features/PurchaseSlice';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';
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
    supplier_id: Yup.string().required('Supplier is required'),
    payment_status: Yup.string().required('payment_status option is required'),
    paid_amount: Yup.number()
      .when('payment_status', (payment_status, schema) => 
        ['advance', 'credit'].includes(payment_status) 
        ? schema.required('Paid amount is required').min(0)
        : schema.notRequired()
      ),
    payment_balance: Yup.number(),
    payment_due_date: Yup.date().nullable()
      .when('payment_status', (payment_status, schema) => 
        ['advance', 'credit'].includes(payment_status) 
        ? schema.required('Last date is required')
        : schema.notRequired()
      ),
    account_id: Yup.string().required('Mode of transaction is required'),
    notes: Yup.string(),
    purchase_items: Yup.array()
    .of(itemSchema).min(1, 'At least one item is required'),
    total_exclude_tax:Yup.number(),
    grand_total:Yup.number(),
    discount:Yup.number().min(1, 'discount must be at least 1%').max(100, 'Discount must not exceed 100%'),
    tax_amount:Yup.number(),
    purchase_order_id:Yup.number(),
    invoice_number:Yup.string().required('Plese add Invoice Number')
});


const ViewPurchase = () => {
  const dispatch = useDispatch()
    const { suppliers,editpurchase,purchaseOrders,products,paymentModes, loading, error } = useSelector((state) => state?.purchases);

    
    const formik = useFormik({
        initialValues: {
            purchase_date: editpurchase?.purchase_date,
            purchase_number: editpurchase?.purchase_number,
            supplier_id: editpurchase?.supplier_id,
            payment_status: editpurchase?.payment_status,
            paid_amount: editpurchase?.paid_amount,
            payment_balance: editpurchase?.payment_balance,
            payment_due_date: editpurchase?.payment_due_date,
            discount: editpurchase?.discount,
            account_id: editpurchase?.account_id,
            purchase_items:editpurchase?.purchase_items,
            notes: editpurchase?.notes,
            total:editpurchase?.total,
            grand_total:editpurchase?.grand_total,
            tax_amount:editpurchase?.tax_amount,
            purchase_order_id:editpurchase?.purchase_order_id,
            invoice_number:editpurchase?.invoice_number,
        },
        validationSchema: purchaseValidationSchema,
        onSubmit: async (values) => {
          try {
              console.log('Final Submission:', values);
      
              // Dispatch the updatePurchase thunk
              const promise = dispatch(updatePurchase({ id: editpurchase.id, purchaseData: values }));
      
              // Handle the promise to access the response data
              promise.then(response => {
                  console.log(response, "response from dispatch sssssssssssshahaaaaaaiiiiiii");
                  if (response.payload) {
                      // Use the response data here, e.g., update state or display success message
                      // You can access specific data from response.payload as needed
                  } else {
                      // Handle update error (e.g., display error message)
                  }
              }).catch(error => {
                  console.error('Error updating purchase:', error);
                  // Handle error (e.g., display error message)
              });
          } catch (error) {
              console.error('Error updating purchase:', error);
              // Handle general error (e.g., display error message)
          }
      },
      
     
      enableReinitialize: true,
  });


  const matchingPurchaseOrder = purchaseOrders?.find((po) => formik.values.purchase_order_id == po.id);
  
   const [showModal, setShowModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
  const [items, setItems] = useState(editpurchase?.purchase_items);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [taxAmount,setTaxAmount] = useState(0)
  const [showPrint,setShowPrint] = useState(true)
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
 }, [items, formik.values.discount, formik.values.paid_amount]);
 


// Function to remove an item from the list
const handleDeleteItem = (index) => {
 const newItems = items?.filter((_, i) => i !== index);
 setItems(newItems);
};



useEffect(() => {
 const filter = matchingPurchaseOrder?.purchase_order_items.map((item)=>{
   const selectedProduct = products.find(product => product.id == item.product_id);
   return {...item, hsn: selectedProduct?.hsn_code,tax:selectedProduct?.tax_rate}
   })
const secondfilter =   filter?.map((item)=>{
     const quantity = item.quantity
     const price = item.price
     const tax = item.tax
     const total = quantity * price;
     const taxAmount = total * tax / 100;
     const totalInclTax = total + taxAmount;

     return {...item, total : total.toFixed(2) ,tax_amount : taxAmount.toFixed(2) ,total_inc_tax : totalInclTax.toFixed(2)}
   })

 setItems(secondfilter)
 console.log("testing useeffedct")
 formik.setFieldTouched('purchase_items', items);

}, [formik.values.purchase_order_id, purchaseOrders]);
useEffect(()=> {
   formik.setFieldValue('purchase_items', items); 
   formik.setFieldValue('total_exclude_tax', total?.toFixed(2));
},[])

useEffect(() => {
dispatch(setHeading("Edit Purchase Bill"));
return () => {
 dispatch(clearHeading());
};
}, [dispatch]);

const handleEditItem = (index,itemsId) => {
const item = items.find(data => data.id === itemsId)
dispatch(editPurchaseColumn({data:item,index:index}))
setShowEditModal(true)
}

console.log(formik.errors,"hello",editpurchase)


  return (
    <div ref={componentRef} className="bg-white  p-5">
    <h2 className="text-xl font-medium mb-5 text-center">View Purchase Bill </h2>
        <div className="grid grid-cols-2 w-full p-4">
            <div className="">
           <div className="">
            <div className="text-lg font-semibold  "> Order From:</div>
            <div className="text-md font-semibold">{editpurchase?.supplier_name}</div>
            <div className="">{editpurchase?.supplier_email}</div>
            <div className="">{editpurchase?.supplier_address}</div>
            <div className="">{editpurchase?.supplier?.gst_number}834945 48499 </div>
            </div>
            <div className="text-lg font-semibold  pt-4">Order  To:</div>

      <div className="text-md font-semibold"> Zain Sale Corp</div>
      <div className="">address address address</div>
      <div className="">pincode state</div>
      <div className="">zain@gmail.com</div>
      <div className="">+91 9999999999</div>

            </div>
            <div className="">
                
             <div className="grid justify-items-end">
                <div className="grid grid-cols-2">

             <div className='gap-5'>
            <div htmlFor="purchase_order_date" className="block text-sm font-medium text-gray-700">Date</div>
            <div htmlFor="purchase_order_date" className="block text-sm font-medium text-gray-700">Purchsae Order</div>
            <div htmlFor="purchase_order_date" className="block text-sm font-medium text-gray-700">Quotation Number</div>
        </div>
             <div className=' gap-5'>
           <div className="">&nbsp; : &nbsp;{editpurchase?.purchase_date}</div>
           <div className="">&nbsp; : &nbsp;{editpurchase?.purchase_date}</div>
           <div className="">&nbsp; : &nbsp;{editpurchase?.purchase_order_id}</div>
        </div>
                </div>
             </div>
            </div>
        </div>
    <form onSubmit={formik.handleSubmit} className="space-y-4">

    {/* Items Table */}
      <div className="mt-6">
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN</th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">physical</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exbound</th> */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Incl Tax</th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            {items?.length > 0 && (

            <tbody className="bg-white divide-y divide-gray-200">
              {items?.map((item, index) => (
                <tr key={index}>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
{
  products?.find(pro => pro.id == item?.product_id)?.product_name || item?.product_id
}
</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.product_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.hsn}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.inbound || 0} </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.outbound || 0}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.tax || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.tax_amount || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.total_inc_tax ||0}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4 justify-center text-right text-sm font-medium">
                    <div className="flex items-center ">
                    <button onClick={() => handleEditItem(index,item.id)} className="text-primary-600 hover:text-red-900">
                    <CiEdit className='mt-5 w-6 h-5' /> &nbsp; &nbsp;
                    </button></div>
                    <button onClick={() => handleDeleteItem(index)} className="text-red-600 hover:text-red-900">
                    <AiOutlineDelete className='w-5 h-5' />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
        )}
          </table>
          
{formik.touched.purchase_items && formik.errors.purchase_items && (
  <p className="text-red-500 text-sm ">{formik.errors.purchase_items}</p>)}

        </div>
      </div>
          <div className="grid gap-2 justify-end mt-5">
{/* Total Display */}
 <div className='flex justify-between'>
     <div className="">
     <label htmlFor="total_exclude_tax" className="block text-sm font-medium text-gray-700">Total Exclude Tax:</label>
      </div>     
      <div className="">
        <input
        id="total_exclude_tax"
        type="text"
        disabled
        {...formik.getFieldProps('total_exclude_tax')}
         // This field is disabled and cannot be edited by the user
        className="text-sm text-end"
      />
        </div>  
    </div>


{/* Grand Total TAx */}
<div className='flex justify-between'>
  <label htmlFor="tax_amount" className="block text-sm font-medium text-gray-700"> Total Tax:</label>
  <input
    id="tax_amount"
    type="text"
    disabled
    value={taxAmount}
    className="text-sm text-end"
  />
</div>
{/* Discount Input */}
<div className='flex justify-between'>
  <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%):</label>
  <input
    id="discount"
    disabled
    {...formik.getFieldProps('discount')}
    className="text-sm text-end"
  />
</div>
{/* Grand Total Display */}
<div className='flex justify-between'>
  <label htmlFor="grandTotal" className="block text-sm font-medium text-gray-700">Grand Total:</label>
  <input
    id="grandTotal"
    type="none"
    disabled
    value={grandTotal?.toFixed(2)}
    
    className="text-sm text-end"
  />
</div>
</div>

   <div className="grid grid-cols-3 gap-3 mt-10">
     {/* payment_status Method */}
     <div className="">
     <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">payment_status Option:</label>

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
      <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Paid Amount</label>
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
        <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Balance Amount:</label>
        <input
          type="text"
          disabled
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
        <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Mode of Transaction:</label>
        <select
  id="account_id"
  disabled
  {...formik.getFieldProps('account_id')}
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value="">Select Transaction method</option>
  {paymentModes.map((item) => (
    <option value={item.id} key={item.id}>
      {item.account_name}
    </option>
  ))}
</select>
        {formik.touched.account_id && formik.errors.account_id && (
          <div className="text-sm text-red-600">{formik.errors.account_id}</div>
        )}
      </div>
    
   </div>
        <div className='my-6'>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes:</label>
        <textarea
          id="notes"
          disabled
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
    {/* <Modal
      visible={showModal}
      onClose={() => setShowModal(false)}
      title="Add Products to Purchase"
      content={<AddItemsForm items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
    /> */}
      {/* <Modal
      visible={showEditModal}
      onClose={() => setShowEditModal(false)}
      title="Edit Items to Purchase"  
      id={"Purchase-column"}
      content={<EditItemsForm items={items} setItems={setItems} onClose={() => setShowEditModal(false)} />}
    /> */}
  </div>
  );
};

export default ViewPurchase;

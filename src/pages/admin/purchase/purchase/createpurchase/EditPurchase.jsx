import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddItemsForm from './AddItemsForm'; // Ensure this component is implemented
import Modal from '../../../../../components/commoncomponents/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {  editPurchaseColumn, updatePurchase } from '../../../../../redux/features/PurchaseSlice';
import { CiEdit } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import EditItemsForm from '../EditItemsForm';
import { ToastContainer } from 'react-toastify';

const itemSchema = Yup.object().shape({
  product_id: Yup.string().required('Product ID is required'),
  quantity: Yup.number().required('Quantity is required'),
  price: Yup.number().required('Price is required'),
  created_at: Yup.date(),
  damage: Yup.mixed().nullable(),
  discount: Yup.mixed().nullable(),
  id: Yup.number(),
  inbound: Yup.mixed().nullable(),
  outbound: Yup.mixed().nullable(),
  purchase_id: Yup.string(),
  return: Yup.mixed().nullable(),
  tax: Yup.mixed().nullable(),
  tax_amount: Yup.mixed().nullable(),
  total: Yup.mixed().nullable(),
  total_inc_tax: Yup.mixed().nullable(),
  updated_at: Yup.date(),
});

// const itemSchema = Yup.object().shape({
//   product_id: Yup.string().required('Product is required'),
//   quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
//   price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
//   tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
//   total: Yup.number(),
//   tax_amount: Yup.number(),
//   total_inc_tax: Yup.number(),
//   });
  

  

const purchaseValidationSchema = Yup.object({
    purchase_date: Yup.date().required('Purchase date is required'),
    purchase_number: Yup.string(),
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
    discount:Yup.number().min(0, 'discount must be at least 1%').max(100, 'Discount must not exceed 100%'),
    tax_amount:Yup.number()
});


const EditPurchase = () => {
  const dispatch = useDispatch()
    const { suppliers,editpurchase,products,paymentModes, loading, error } = useSelector((state) => state?.purchases);
     console.log(suppliers,"suppliers list");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [items, setItems] = useState(editpurchase?.purchase_items);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)

  
    console.log(editpurchase,"checking editpurchaseid",editpurchase?.id)
    
    
    
    
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
            notes: editpurchase.notes,
            total:editpurchase?.total,
            grand_total:editpurchase?.grand_total,
            tax_amount:editpurchase?.tax_amount,
        },
        validationSchema: purchaseValidationSchema,
        onSubmit: async (values) => {
          console.log(values,"shshshhshshsshsh finalyyyyyyyyyyyyyyyyyyyyyyyyy")
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
    console.log(items,"it is to chaeck the items is available or not")
    useEffect(() => {
      const newTotal = items.reduce((acc, item) => acc + (item.quantity * item.price ), 0);
      const totalTax = items.reduce((acc,item) => acc + parseInt(item.tax_amount) , 0)
      const newGrandTotal = newTotal  - (newTotal * formik.values.discount / 100) + totalTax
      const newpayment_balance = newGrandTotal - formik.values.paid_amount;
      console.log(totalTax,"it is the total taxes")
      setTaxAmount(totalTax)
      setTotal(newTotal);
      setGrandTotal(newGrandTotal);
  
      // Update Formik's field values
      formik.setFieldValue('total_exclude_tax', newTotal.toFixed(2));
      formik.setFieldValue('grand_total', newGrandTotal.toFixed(2));
      formik.setFieldValue('payment_balance', newpayment_balance.toFixed(2));
      formik.setFieldValue('tax_amount', totalTax);
  }, [items, formik.values.discount, formik.values.paid_amount]);

   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };


  const handleEditItem = (index,itemsId) => {
    const item = items.find(data => data.id === itemsId)
    dispatch(editPurchaseColumn({data:item,index:index}))
    setShowEditModal(true)
   }

  useEffect(()=> {
    formik.setFieldValue('purchase_items', items); 
    formik.setFieldValue('total_exclude_tax', total.toFixed(2));
},[])


  return (
    <div className="  p-5">
      <h2 className="text-xl font-bold mb-5 text-center">Edit Purchase</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="flex justify-between">
        <div>
            <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">Date:</label>
            <DatePicker
            disabled
                selected={formik.values.purchase_date}
                onChange={(date) => formik.setFieldValue('purchase_date', date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.purchase_date && formik.errors.purchase_date && (
                <p className="text-red-500 text-xs italic">{formik.errors.purchase_date}</p>
            )}
        </div>

        <div>
            <label htmlFor="purchase_number" className="block text-sm font-medium text-gray-700">Purchase ID:</label>
            <input
            disabled
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
   <div className="grid grid-cols-4">

      <div className=''>
          <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">Supplier:</label>
          <select
          disabled
              id="supplier_id"
              {...formik.getFieldProps('supplier_id')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
              <option value="">Select a supplier</option>
              {suppliers.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
              ))}
          </select>
          {formik.touched.supplier_id && formik.errors.supplier_id && (
              <p className="text-red-500 text-xs italic">{formik.errors.supplier_id}</p>
          )}
      </div>
   </div>


        <button type="button" onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Products
        </button>
     
     

     

      {/* Items Table */}
      {items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Items Added</h3>
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Physical</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transist</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Incl Tax</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.inbound || 0} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.outbound || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_inc_tax}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4 justify-center text-right text-sm font-medium">
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
            </table>

          </div>
          
        </div>
      )}
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
      {formik.touched.discount && formik.errors.discount && (
            <div className="text-sm text-red-600">{formik.errors.discount}</div>
          )}
  </div>

  {/* Grand Total Display */}
  <div>
    <label htmlFor="grandTotal" className="block text-sm font-medium text-gray-700">Grand Total:</label>
    <input
      id="grandTotal"
      type="text"
      value={grandTotal.toFixed(2)}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</div>

     <div className="grid grid-cols-3 gap-3 mt-10">
       {/* payment_status Method */}
       <div className="">
       <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">payment_status Option:</label>

       <select
        id="payment_status"
        {...formik.getFieldProps('payment_status')}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select payment_status Method</option>
        <option value="full">Full</option>
        <option value="advance">Advance</option>
        <option value="credit">Credit</option>
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm sm:text-sm"
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
            <div>
          <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Mode of Transaction:</label>
          <select
            id="account_id"
            {...formik.getFieldProps('account_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value =''>select Transaction method</option>
            {paymentModes?.map((item) => (
        <option key={item.id} value={item.id}>{item.account_name}</option>
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
            {...formik.getFieldProps('notes')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add any relevant notes here..."
          />
        </div>
        <div className="flex justify-center my-4">   <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Update Purchase
        </button></div>
        </form>
         {/* Modal for adding items */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Items to Purchase"
        content={<AddItemsForm items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
        <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Items to Purchase"  
        id={"Purchase-column"}
        content={<EditItemsForm items={items} setItems={setItems} onClose={() => setShowEditModal(false)} />}
      />
    </div>
  );
};

export default EditPurchase;

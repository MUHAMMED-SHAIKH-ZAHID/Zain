import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useDispatch, useSelector } from 'react-redux';
import EditItemsForm from './EditItemsForm';
import Modal from '../../../../components/commoncomponents/Modal';
import AddItemsForm from './AddItemsForm';
import { createSale, editSaleColumn } from '../../../../redux/features/SalesSlice';
import { useNavigate } from 'react-router-dom';

const itemSchema = Yup.object().shape({
    product_id: Yup.string().required('Product is required'),
    quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
    inbound: Yup.number().min(0, 'Inbound must be at least 0'),
    outbound: Yup.number().min(0, 'Outbound must be at least 0'),
    price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
    tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
    total: Yup.number(),
    tax_amount: Yup.number(),
    total_inc_tax: Yup.number(),
    id:Yup.number(),
    createdat:Yup.number(),
    updatedat:Yup.number(),
    });
    
  

const purchaseValidationSchema = Yup.object({
    quotation_date: Yup.date().required('Purchase date is required'),
    customer_id: Yup.string().required('Supplier is required'),
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
    discount:Yup.number().min(0, 'discount must be at least 1%').max(100, 'Discount must not exceed 100%').notRequired(),
    tax_amount:Yup.number()
});


const SalesQuoteConvert = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const { customers,convertSales,products, loading, error } = useSelector((state) => state?.salesQuotation);
    const { paymentModes} = useSelector((state) => state?.sales);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [items, setItems] = useState(convertSales?.items);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)


    const formik = useFormik({
        initialValues: {
            quotation_date: convertSales?.quotation_date,
            customer_id: convertSales?.customer_id,
            payment_status: convertSales?.payment_status,
            paid_amount: convertSales?.paid_amount || '',
            payment_balance: convertSales?.payment_balance || '',
            payment_due_date: convertSales?.payment_due_date ||'',
            discount: convertSales?.discount || 0,
            account_id: convertSales?.account_id,
            sales_items:convertSales?.items,
            notes: convertSales.notes,
            // total:convertSales?.total,
            total_exclude_tax:convertSales?.total_exclude_tax,
            grand_total:convertSales?.grand_total,
            tax_amount:convertSales?.tax_amount,
        },
        validationSchema: purchaseValidationSchema,
        onSubmit: (values) => {
            dispatch(createSale(values))
            navigate('/invoice/order')

        },
        enableReinitialize: true,  // This is crucial for reinitializing the form when convertSales changes

    });
    useEffect(() => {
      const newTotal = items?.reduce((acc, item) => acc + (item.quantity * item.price ), 0);
      const totalTax = items?.reduce((acc,item) => acc + parseInt(item.tax_amount) , 0)
      const newGrandTotal = newTotal   + totalTax - (newTotal * formik.values?.discount / 100)
      const newpayment_balance = newGrandTotal - formik.values.paid_amount;
      setTaxAmount(totalTax)
      setTotal(newTotal);
      setGrandTotal(newGrandTotal);
  
      // Update Formik's field values
      formik.setFieldValue('total_exclude_tax', newTotal?.toFixed(2));
      formik.setFieldValue('grand_total', newGrandTotal?.toFixed(2));
      formik.setFieldValue('payment_balance', newpayment_balance?.toFixed(2));
      formik.setFieldValue('tax_amount', totalTax);
  }, [items, formik.values.discount, formik.values.paid_amount]);

   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleEditItem = (index,itemsId) => {
   const item = items.find(data => data.id === itemsId)
   dispatch(editSaleColumn({data:item,index:index}))
   setShowEditModal(true)
  }

  return (
    <div className="  p-5">
      <h2 className="text-xl font-bold mb-5 text-center ">Create Sales</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="flex justify-between">
      <div>
        <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Customer:</label>
        <select
            id="customer_id"
            disabled
            {...formik.getFieldProps('customer_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">Select a Customer</option>
            {customers.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </select>
        {formik.touched.customer_id && formik.errors.customer_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.customer_id}</p>
        )}
    </div>
        <div>
            <label htmlFor="quotation_date" className="block text-sm font-medium text-gray-700">Date:</label>
            <DatePicker
                selected={formik.values.quotation_date}
                onChange={(date) => formik.setFieldValue('quotation_date', date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.quotation_date && formik.errors.quotation_date && (
                <p className="text-red-500 text-xs italic">{formik.errors.quotation_date}</p>
            )}
        </div>

  
        
    </div>

  


        <button type="button" onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Products
        </button>
     
     

     

      {/* Items Table */}
      {items?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Items Added</h3>
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inbound</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exbound</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.inbound || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.outbound || 0} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_inc_tax}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditItem(index,item.id)} className="text-primary-600 hover:text-red-900">
                        Edit &nbsp; &nbsp;
                      </button>
                      <button onClick={() => handleDeleteItem(index)} className="text-red-600 hover:text-red-900">
                        Delete
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
            <option value="card">Card</option>
            <option value="online">Online</option>
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
        <div className="flex justify-center my-4">   <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Convert to Sales
        </button></div>
        </form>
         {/* Modal for adding items */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Products to Purchase"
        id={"purchase-column-Add"}
        content={<AddItemsForm items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
      <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Items to Purchase"
        id={"Purchaseedit-column"}
        content={<EditItemsForm items={items} setItems={setItems} onClose={() => setShowEditModal(false)} />}
      />
    </div>
  );
};

export default SalesQuoteConvert;


import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddItemsForm from './AddItemsForm'; // Ensure this component is implemented
import Modal from '../../../../components/commoncomponents/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createSale } from '../../../../redux/features/SalesSlice';
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
  });
  

const purchaseValidationSchema = Yup.object({
    sales_date: Yup.date().required('Sale date is required'),
    sales_number: Yup.string(),
    customer_id: Yup.string().required('Customer is required'),
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
    transaction_mode: Yup.string().required('Mode of transaction is required'),
    notes: Yup.string(),
    items: Yup.array()
    .of(itemSchema).min(1, 'At least one item is required'),
    total:Yup.number(),
    grand_total:Yup.number(),
    discount:Yup.number().min(1, 'discount must be at least 1%').max(100, 'Discount must not exceed 100%'),
    status:Yup.string,
});


const AddSale = () => {
  const dispatch = useDispatch()
    const { customer,products, loading, error } = useSelector((state) => state?.sales);
     console.log(customer,"suppliers list",products);
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const navigate = useNavigate()

    
    
    
    
    const formik = useFormik({
        initialValues: {
            sales_date: new Date(),
            sales_number: '',  
            customer_id: '',
            payment_status: '',
            paid_amount: '',
            payment_balance: '',
            payment_due_date: '',
            discount: '',
            transaction_mode: '',
            items:[],
            notes: '',
            total:'',
            grand_total:'',
            status:'hold'
        },
        validationSchema: purchaseValidationSchema,
        onSubmit: (values) => {
            console.log("testing");
            console.log('Final Submission:', values);
            dispatch(createSale(values))
            // navigate('/sales/')

        },
    });
    console.log(items,"it is to chaeck the items is available or not",products)
    useEffect(() => {
      const newTotal = items.reduce((acc, item) => acc + (item.quantity * item.price * (1 + item.tax / 100)), 0);
      const newGrandTotal = newTotal - (newTotal * formik.values.discount / 100);
      const newpayment_balance = newGrandTotal - formik.values.paid_amount;
  
      setTotal(newTotal);
      setGrandTotal(newGrandTotal);
  
      // Update Formik's field values
      formik.setFieldValue('total', newTotal.toFixed(2));
      formik.setFieldValue('grand_total', newGrandTotal.toFixed(2));
      formik.setFieldValue('payment_balance', newpayment_balance.toFixed(2));
  }, [items, formik.values.discount, formik.values.paid_amount]);


   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Compute total price for an item including tax
  const computeTotalPrice = (item) => {
    return (item.qty * item.price * (1 + item.tax / 100)).toFixed(2);
  };


useEffect(()=> {
    formik.setFieldValue('items', items); 
    formik.setFieldValue('total', total.toFixed(2));
},[])

  return (
    <div className="  p-5">
      <h2 className="text-xl font-bold mb-5 text-center">Create Sale</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="flex justify-between">
        <div>
            <label htmlFor="sales_date" className="block text-sm font-medium text-gray-700">Date:</label>
            <DatePicker
                selected={formik.values.sales_date}
                onChange={(date) => formik.setFieldValue('sales_date', date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.sales_date && formik.errors.sales_date && (
                <p className="text-red-500 text-xs italic">{formik.errors.sales_date}</p>
            )}
        </div>

        <div>
            <label htmlFor="sales_number" className="block text-sm font-medium text-gray-700">Sale ID:</label>
            <input
                id="sales_number"
                type="text"
                {...formik.getFieldProps('sales_number')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.sales_number && formik.errors.sales_number && (
                <p className="text-red-500 text-xs italic">{formik.errors.sales_number}</p>
            )}
        </div>
    </div>

    <div>
        <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Customer:</label>
        <select
            id="customer_id"
            {...formik.getFieldProps('customer_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">Select a customer</option>
            {customer?.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </select>
        {formik.touched.customer_id && formik.errors.customer_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.customer_id}</p>
        )}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inbound</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exbound</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.inbound}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.outbound}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
        <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total:</label>
        <input
          id="total"
          type="text"
          {...formik.getFieldProps('total')}
          disabled // This field is disabled and cannot be edited by the user
          className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
       <label htmlFor="transaction_mode" className="block text-sm font-medium text-gray-700">payment_status Option:</label>

       <select
        id="payment_status"
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
            type="text"
            {...formik.getFieldProps('payment_balance')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm sm:text-sm"
            placeholder="Balance Amount"
          />

          </div>

          {/* Last Date - Conditional */}
          <div className="">
          <label htmlFor="transaction_mode" className="block text-sm font-medium text-gray-700">Due Date:</label>

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
          <label htmlFor="transaction_mode" className="block text-sm font-medium text-gray-700">Mode of Transaction:</label>
          <select
            id="transaction_mode"
            {...formik.getFieldProps('transaction_mode')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value =''>select Transaction method</option>
            <option value="cash">cash</option>
            <option value="card">card</option>
            <option value="online">online</option>
          </select>
          {formik.touched.transaction_mode && formik.errors.transaction_mode && (
            <div className="text-sm text-red-600">{formik.errors.transaction_mode}</div>
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
        <div className="flex justify-center my-4">   <button type="submit" className="bg-zinc-900 hover:bg-black text-white font-bold py-2 px-4 rounded">
          Submit Sale
        </button></div>
        </form>
         {/* Modal for adding items */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Products to Purchase"
        content={<AddItemsForm items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
    </div>
  );
};

export default AddSale;

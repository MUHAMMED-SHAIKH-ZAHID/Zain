import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddItemsForm from './createpurchase/AddItemsForm'; // Ensure this component is implemented

import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../components/commoncomponents/Modal';
import { createPurchase, editPurchaseColumn } from '../../../../redux/features/PurchaseSlice';
import EditItemsForm from './EditItemsForm';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';

// const itemSchema = Yup.object().shape({
//   product_id: Yup.string().required('Product is required'),
//   quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
//   inbound: Yup.number().min(0, 'Inbound must be at least 0'),
//   outbound: Yup.number().min(0, 'Outbound must be at least 0'),
//   price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
//   tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
//   total: Yup.number(),
//   tax_amount: Yup.number(),
//   total_inc_tax: Yup.number(),
//   id:Yup.number(),
//   createdat:Yup.number(),
//   updatedat:Yup.number(),
//   });

const itemSchema = Yup.object().shape({
  product_id: Yup.string().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
  tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
  total: Yup.number(),
  tax_amount: Yup.number(),
  total_inc_tax: Yup.number(),
  });

  


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
    discount:Yup.number().min(0, 'discount must be at least 1%').max(100, 'Discount must not exceed 100%').notRequired(),
    tax_amount:Yup.number()
});

const PurchaseQuoteConvert = () => {
  const dispatch = useDispatch()
    const { suppliers,convertpurchase,products, loading, error } = useSelector((state) => state?.purchaseQuotation);
    const { paymentModes} = useSelector((state) => state?.purchases);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [items, setItems] = useState(convertpurchase?.purchase_order_items);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)
    const [showPrint,setShowPrint] = useState(true)
    const navigate = useNavigate()

    const handlePrintfun = () => {
      setShowPrint(false); // Hide elements
      setTimeout(() => {
        handlePrint(); // Trigger print operation
        setTimeout(() => {
          setShowPrint(true); // Restore visibility after printing
        }, 100); // You might adjust this timeout based on your needs
      }, 0);
    };
   
    const componentRef = useRef();
 
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => setShowPrint(false),
    onAfterPrint: () => { setShowPrint(true), navigate('/purchase/quotation')},
  });



    
    const formik = useFormik({
        initialValues: {
            purchase_date: convertpurchase?.purchase_order_date || new Date(), // Ensure default value if undefined
            supplier_id: convertpurchase?.supplier_id || '',
            payment_status: convertpurchase?.payment_status || '',
            paid_amount: convertpurchase?.paid_amount || 0,
            payment_balance: convertpurchase?.payment_balance || 0,
            payment_due_date: convertpurchase?.payment_due_date || null,
            discount: convertpurchase?.discount || 0,
            account_id: convertpurchase?.account_id || '',
            purchase_items: convertpurchase?.purchase_order_items || [],
            notes: convertpurchase?.notes || '',
            grand_total: convertpurchase?.grand_total || 0,
            tax_amount: convertpurchase?.tax_amount || 0,
        },
        
        validationSchema: purchaseValidationSchema,
        onSubmit: (values) => {
            dispatch(createPurchase(values))
            handlePrint(); // Trigger print after submission


        },
        enableReinitialize: true,  // This is crucial for reinitializing the form when convertpurchase changes

    });

  

    useEffect(() => {
      const newTotal = items?.reduce((acc, item) => acc + (item.quantity * item.price ), 0);
      const totalTax = items?.reduce((acc,item) => acc + parseInt(item.tax_amount) , 0)
      const newGrandTotal = newTotal   + totalTax - (newTotal * formik.values?.discount / 100)
      const newpayment_balance = newGrandTotal - formik.values?.paid_amount;
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
   dispatch(editPurchaseColumn({data:item,index:index}))
   setShowEditModal(true)
  }
  
  return (
    <div ref={componentRef} className="  mx-10 m-5">
      <h2 className="text-xl font-bold mb-5 text-center">Create Purchase</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="flex justify-between">
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

        <div>
            <label htmlFor="purchase_number" className="block text-sm font-medium text-gray-700">Quotation ID:</label>
            <input
                id="purchase_number"
                type="text"
                disabled
                value={convertpurchase?.purchase_order_number}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.purchase_number && formik.errors.purchase_number && (
                <p className="text-red-500 text-xs italic">{formik.errors.purchase_number}</p>
            )}
        </div>
    </div>

    <div>
        <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">Supplier:</label>
        <select
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
        <div className="flex justify-center my-4">   <button onClick={() => formik.validateForm().then(() => setShowPrint(true))} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit Purchase And Print
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

export default PurchaseQuoteConvert;


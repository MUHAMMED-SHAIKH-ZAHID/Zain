import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import AddItemsForm from '../purchase/createpurchase/AddItemsForm';
import { updatePurchasequotation } from '../../../../redux/features/PurchaseQuotationSlice';
import Modal from '../../../../components/commoncomponents/Modal';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';
import { ToastContainer } from 'react-toastify';
import AddItemsQuoteForm from './AddItemsQuoteForm';
import { useNavigate } from 'react-router-dom';

// const itemSchema = Yup.object().shape({
//     product_id: Yup.string().required('Product is required'),
//     quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
//     price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
//     tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
//     total: Yup.number(),
//     tax_amount: Yup.number(),
//     total_inc_tax: Yup.number(),
//     purchase_order_id:Yup.number(),
//     id:Yup.number(),
//     inbound: Yup.number().min(0, 'physical must be at least 0'),
//     outbound: Yup.number().min(0, 'transist must be at least 0'),
//     createdat:Yup.number(),
//     updatedat:Yup.number(),
//     });
    
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
      purchase_order_date: Yup.date().required('Purchase date is required'),
      supplier_id: Yup.string().required('Supplier is required'),
      notes: Yup.string(),
      purchase_order_items: Yup.array()
      .of(itemSchema).min(1, 'At least one item is required'),
      total_exclude_tax:Yup.number(),
      grand_total:Yup.number(),
      tax_amount:Yup.number(),
  });

const EditPurchaseQuotation = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const { suppliers,editpurchase,products, loading, error } = useSelector((state) => state?.purchaseQuotation);
     console.log(suppliers,"suppliers list");
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState(editpurchase?.purchase_order_items || []);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)

  

    console.log(editpurchase,"checking editpurchaseid",editpurchase?.id)
    
    
    
    
    const formik = useFormik({
        initialValues: {
            purchase_order_date: editpurchase?.purchase_order_date,
            supplier_id: editpurchase?.supplier_id,
            purchase_order_items:editpurchase?.purchase_order_items,
            notes: editpurchase?.notes,
            total_exclude_tax:editpurchase?.total_exclude_tax,
            grand_total:editpurchase?.grand_total,
            tax_amount:editpurchase?.tax_amount
        },
        validationSchema: purchaseValidationSchema,
        onSubmit: (values) => {
            console.log("testing");
            console.log('Final Submission:', values);
              dispatch(updatePurchasequotation({ id: editpurchase.id, purchaseData: values }))
              // .then((response) => {
              //   console.log("after disppatch",response)
              //   if (response.type.endsWith('fulfilled')) {
              //     ToastContainer.success('Purchase created successfully!');
              //     history.push('/purchase/quotation'); 
              //   } else if (response.type.endsWith('rejected')) {
              //     ToastContainer.error(response.error.message || 'Error creating purchase');
              //   }
              // });
              navigate('/purchase/quotation')

        },
        enableReinitialize: true,  // This is crucial for reinitializing the form when editpurchase changes

    });
    console.log(items,"it is to chaeck the items is available or not")
    useEffect(() => {
        const newTotal = items?.reduce((acc, item) => acc + (item.quantity * item.price ), 0);
        const totalTax = items?.reduce((acc,item) => acc + parseInt(item.tax_amount) , 0)
        const newGrandTotal = newTotal  + totalTax
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

//   useEffect(() => {
//    setItems(editpurchase?.purchase_order_items)
//   },[] )
useEffect(()=> {
  formik.setFieldValue('purchase_order_items', items); 
  formik.setFieldValue('total_exclude_tax', total.toFixed(2));
},[items,total])
  

  // Compute total price for an item including tax
  const computeTotalPrice = (item) => {
    return (item.qty * item.price * (1 + item.tax / 100)).toFixed(2);
  };

  useEffect(() => {
    dispatch(setHeading("Purchase Quote"));

    // Optionally reset the heading when the component unmounts
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);



  return (
    <div className="  p-5">
      <h2 className="text-xl font-bold mb-5 text-center">Edit Purchase</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="flex justify-between">
        <div>
            <label htmlFor="purchase_order_date" className="block text-sm font-medium text-gray-700">Date:</label>
            <DatePicker
                selected={formik.values.purchase_order_date}
                onChange={(date) => formik.setFieldValue('purchase_order_date', date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.purchase_order_date && formik.errors.purchase_order_date && (
                <p className="text-red-500 text-xs italic">{formik.errors.purchase_order_date}</p>
            )}
        </div>

        <div>
            <label htmlFor="purchase_order_number" className="block text-sm font-medium text-gray-700">Purchase ID:</label>
            <input
                id="purchase_order_number"
                type="text"
                disabled
                value={editpurchase?.purchase_order_number}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.purchase_order_number && formik.errors.purchase_order_number && (
                <p className="text-red-500 text-xs italic">{formik.errors.purchase_order_number}</p>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_inc_tax}</td>
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
            <div className="grid gap-4 justify-end mt-5">
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
      type="text"
      value={grandTotal.toFixed(2)}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    </div>
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
          Update Purchase
        </button></div>
        </form>
         {/* Modal for adding items */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Products to Purchase"
        content={<AddItemsQuoteForm  items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
    </div>
  );
};

export default EditPurchaseQuotation;

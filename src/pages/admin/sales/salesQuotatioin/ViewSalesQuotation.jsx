import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../../components/commoncomponents/Modal';
import AddItemsForm from './AddItemsForm';
import { convertSalesQuotation } from '../../../../redux/features/SalesQuotationSlice';

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
    createdate:Yup.number(),
    updatedate:Yup.number(),
    });
    
  
  const purchaseValidationSchema = Yup.object({
      quotation_date: Yup.date().required('Purchase date is required'),
      customer_id: Yup.string().required('Supplier is required'),
      notes: Yup.string(),
      items: Yup.array()
      .of(itemSchema).min(1, 'At least one item is required'),
      total_exclude_tax:Yup.number().notRequired(),
      grand_total:Yup.number(),
      tax_amount:Yup.number().notRequired(),
  });

const ViewSalesQuotation = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const { customers,viewSales,products, loading, error } = useSelector((state) => state?.salesQuotation);
     console.log(customers,"customers list");
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState(viewSales?.items || []);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)

  

    console.log(viewSales,"checking viewSalesid",viewSales?.id)
    
    
    
    
    const formik = useFormik({
        initialValues: {
            quotation_date: viewSales?.quotation_date,
            customer_id: viewSales?.customer_id,
            items:viewSales?.items,
            purchase_order_number:viewSales?.purchase_order_number,
            notes: viewSales?.notes,
            total_exclude_tax:viewSales?.total_exclude_tax,
            grand_total:viewSales?.grand_total,
            tax_amount:viewSales?.tax_amount
        },
        validationSchema: purchaseValidationSchema,
        onSubmit: (values) => {
            console.log("testing");
            console.log('Final Submission:', values);
            dispatch(convertSalesQuotation(values))
            navigate('/sales/quotation/convert')
            console.log("Reste testing testing testing")
            // dispatch(updatePurchasequotation({ id: viewSales.id, purchaseData: values }))

        },
        enableReinitialize: true,  // This is crucial for reinitializing the form when viewSales changes

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
        // formik.setFieldValue('payment_balance', newpayment_balance.toFixed(2));
        formik.setFieldValue('tax_amount', totalTax);
    }, [items, formik.values.discount, formik.values.paid_amount]);


   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };






  return (
    <div className="  mx-6 m-5 border drop-shadow-sm">
        <div className="grid grid-cols-2 w-full p-5">
            <div className="">
            {/* <div className="text-lg font-bold mb-1"> Quote To:</div> */}

      <div className="text-md font-semibold"> Zain Sale Corp</div>
      <div className="">address address address</div>
      <div className="">pincode state</div>
      <div className="">zain@gmail.com</div>
      <div className="">+91 9999999999</div>

            <div className="">
            <div className="text-lg font-bold my-1 mt-2"> Quote to:</div>
            <div className="text-md font-semibold">{viewSales?.customer_name}</div>
            <div className="">{viewSales?.customer_email}</div>
            <div className="">{viewSales?.customer_address}</div>
            <div className="">{viewSales?.supplier?.gst_number}92077 83535</div>
            </div>
            </div>
            <div className="">
                
                <div className="text-2xl font-bold justify-center flex mb-3">Sales Quotation</div>
             <div className="grid justify-items-end">
                <div className="grid grid-cols-2">

             <div className='gap-5'>
            <div htmlFor="quotation_date" className="block text-sm font-medium text-gray-700">Date:</div>
            <div htmlFor="quotation_date" className="block text-sm font-medium text-gray-700">Quotation Number:</div>
        </div>
             <div className=' gap-5'>
           <div className="">{viewSales?.quotation_date}</div>
           <div className="">{viewSales?.quotation_number}</div>
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
      type="text"
      value={grandTotal.toFixed(2)}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    </div>
  </div>
 
</div>


   
          <div className='my-6 p-5'>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes:</label>
          <textarea
          disabled
            id="notes"
            {...formik.getFieldProps('notes')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add any relevant notes here..."
          />
        </div>
        <div className="flex justify-center my-4 pb-10" >   <button type="submit" className="bg-zinc-800 hover:bg-black text-white font-bold py-2 px-4 rounded">
          Convert To Sale
        </button></div>
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

export default ViewSalesQuotation;

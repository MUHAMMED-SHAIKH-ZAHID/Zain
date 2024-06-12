import { useEffect, useRef, useState } from 'react';
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
import { MdDelete } from 'react-icons/md';

const itemSchema = Yup.object().shape({
  comment: Yup.string(),
  mrp: Yup.number().min(1, 'MRP must be at least 1').required('MRP is required'),
  price: Yup.number().min(1, 'Purchase price must be at least 1').required('Purchase price is required'),
  product_id: Yup.string().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  total: Yup.number(),
});

const purchaseValidationSchema = Yup.object({
  purchase_order_date: Yup.date().required('Purchase date is required'),
  purchase_order_number: Yup.string(),
  supplier_id: Yup.string().required('Supplier is required'),
  notes: Yup.string(),
  purchase_order_items: Yup.array().of(itemSchema).min(1, 'Please Add Atleast 1 Item to Create order'),
  grand_total: Yup.number().required('Grand total is required'),
  expected_delivery_date: Yup.date().required('Expected delivery date is required'),
  payment_terms: Yup.string().required('Payment terms are required'),
});

const PrintPurchaseQuote = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const { suppliers,viewpurchase,products, loading, error } = useSelector((state) => state?.purchaseQuotation);
     console.log(suppliers,"suppliers list");
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState(viewpurchase?.purchase_order_items || []);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)
    const [showPrint,setShowPrint] = useState(true)


  

    console.log(viewpurchase,"checking viewpurchaseid",viewpurchase?.id)
    
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
      dispatch(setHeading("Purchase Quote"));
  
      // Optionally reset the heading when the component unmounts
      return () => {
        dispatch(clearHeading());
      };
    }, [dispatch]);
  
    
    
    
    const formik = useFormik({
        initialValues: {
            purchase_order_date: viewpurchase?.purchase_order_date,
            supplier_id: viewpurchase?.supplier_id,
            purchase_order_items:viewpurchase?.purchase_order_items,
            purchase_order_number:viewpurchase?.purchase_order_number,
            notes: viewpurchase?.notes,
            grand_total:viewpurchase?.grand_total,
            expected_delivery_date:viewpurchase?.expected_delivery_date,
            payment_terms:viewpurchase?.payment_terms
        },
        validationSchema: purchaseValidationSchema,
        onSubmit: (values) => {
            console.log("testing");
            console.log('Final Submission:', values);
            dispatch(convertPurchase(values))
            // navigate('/purchase/order/convert')
            // dispatch(updatePurchasequotation({ id: viewpurchase.id, purchaseData: values }))

        },
        enableReinitialize: true,  // This is crucial for reinitializing the form when viewpurchase changes

    });
    console.log(items,"it is to chaeck the items is available or not")

    const calculateGrandTotal = () => {
      const total = items.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);
      setGrandTotal(total);
      formik.setFieldValue("grand_total",grandTotal)
      formik.setFieldValue("purchase_order_items",items)
    };
  
    useEffect(() => {
      dispatch(setHeading('Purchase Order'));
      return () => {
        dispatch(clearHeading());
      };
    }, [dispatch]);
  
    useEffect(() => {
      calculateGrandTotal();
    }, [items]);
  
    const handleDeleteItem = (index) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    };
      



  return (
    <div ref={componentRef} className="  px-6 p-5 border bg-white  drop-shadow-sm">
                      <div className="text-xl font-semibold justify-center flex mb-3"> Purchase Order</div>

        <div className="grid grid-cols-2 w-full p-4">
            <div className="">
           <div className="">
            <div className="text-lg font-semibold  "> Order From:</div>
            <div className="text-md font-semibold">{viewpurchase?.supplier_name}</div>
            <div className="">{viewpurchase?.supplier_email}</div>
            <div className="">{viewpurchase?.supplier_address}</div>
            <div className="">{viewpurchase?.supplier?.gst_number}834945 48499 </div>
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
            <div htmlFor="purchase_order_date" className="block text-sm font-medium text-gray-700">Quotation Number</div>
        </div>
             <div className=' gap-5'>
           <div className="">&nbsp; : &nbsp;{viewpurchase?.purchase_order_date}</div>
           <div className="">&nbsp; : &nbsp;{viewpurchase?.purchase_order_number}</div>
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

                    <td className="px-6 py-6  whitespace-nowrap text-sm text-gray-500">{item?.hsn}</td>
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
          <div className="flex justify-center items-center py-2">
{formik.touched.purchase_items && formik.errors.purchase_items && (
    <p className="text-red-500 text-sm ">{formik.errors.purchase_items}</p>)}
            </div>  

          </div>
        </div>
            <div className="grid gap-4 justify-end mt-5">
        {/* Grand Total Display */}
        <div className='flex justify-between items-center gap-10 mx-2'>
          <div>
            <label htmlFor="grandTotal" className="block text-sm font-medium text-gray-700">Grand Total:</label>
          </div>
          <div>
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
      
      <div className='flex justify-between'>
        <div>
          <label htmlFor="expected_delivery_date" className="block text-sm font-medium text-gray-700">Expected Delivery Date:</label>
          <DatePicker
            id="expected_delivery_date"
            selected={formik.values.expected_delivery_date}
            onChange={(date) => formik.setFieldValue('expected_delivery_date', date)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.expected_delivery_date && formik.errors.expected_delivery_date && (
            <p className="text-red-500 text-xs italic">{formik.errors.expected_delivery_date}</p>
          )}
        </div>
        <div>
          <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700">Payment Terms:</label>
          <input
            id="payment_terms"
            type="text"
            {...formik.getFieldProps('payment_terms')}
            placeholder="Payment terms"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.payment_terms && formik.errors.payment_terms && (
            <p className="text-red-500 text-xs italic">{formik.errors.payment_terms}</p>
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

export default PrintPurchaseQuote;

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { editSaleColumn, updateSale } from '../../../../redux/features/SalesSlice';
import Modal from '../../../../components/commoncomponents/Modal';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';
import { useNavigate } from 'react-router-dom';
import { LuImport } from 'react-icons/lu';
import AddItemsForm from './AddItemsForm';
import EditItemsForm from './EditItemsForm';
import { toast } from 'react-toastify';
import { format } from 'date-fns';






const itemSchema = Yup.object().shape({
  product_id: Yup.string().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
  mrp: Yup.number()
  .min(1, 'MRP must be at least 1')
  .required('MRP is required')
  .when('price', (price, schema) => {
    return schema.min(price, 'MRP must be equal to or greater than the purchase price');
  }), 
  //  discount: Yup.number().min(0, 'Discount must be at least 0').max(100, 'Discount must not exceed 100').required('Discount is required'),
  tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
  total: Yup.number(),
  tax_amount: Yup.number(),
  total_inc_tax: Yup.number(),
  hsn:Yup.number()
  });
  

  const salesValidationSchema = Yup.object({
    sales_date: Yup.date().required('Invoice date is required'),
     invoice_number: Yup.string(),
    customer_id: Yup.string().required('Vendor is required'),
    payment_status: Yup.string().required('Payment status option is required'),
    paid_amount: Yup.number()
      .when('payment_status', (payment_status, schema) =>
        ['partial'].includes(payment_status)
          ? schema.required('Paid amount is required').min(0)
          : schema.notRequired()
      ),
    payment_balance: Yup.number(),
    payment_due_date: Yup.date().nullable(), // No need for Yup.string()
    notes: Yup.string(),
     sales_items: Yup.array()
      .of(itemSchema) // Ensure itemSchema is defined
      ,
    total_exclude_tax: Yup.number(),
    grand_total: Yup.number(),
    discount: Yup.number().min(0.01, 'Discount must be at least 1%').max(1, 'Discount must not exceed 100%'),
    tax_amount: Yup.number(),
     sales_order_id: Yup.string(),
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
      sale_order_number: Yup.string(), // Added validation for sale_order_number

  });


const EditSales = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const { customers,editsales,products,paymentModes, loading, error } = useSelector((state) => state?.sales);

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [items, setItems] = useState(editsales?.sales_items);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)

    const [customErrMsg,setCustomErrMsg] = useState('')
  
    
    
    const formik = useFormik({
      initialValues: {
        sales_date: editsales?.sales_date ? format(new Date(editsales.sales_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        invoice_number: editsales?.invoice_number || '',
        customer_id: editsales?.customer_id || '',
        payment_status: editsales?.payment_status || '',
        paid_amount: editsales?.paid_amount || '',
        payment_balance: editsales?.payment_balance || '',
        payment_due_date: editsales?.payment_due_date || '',
        discount: editsales?.discount || '',
        account_id: editsales?.account_id || '',
        payment_mode: editsales?.payment_mode || '',
        sales_items: editsales?.sales_items || [],
        notes: editsales?.notes || '',
        total_exclude_tax: editsales?.total_exclude_tax || '',
        grand_total: editsales?.grand_total || '0',
        tax_amount: editsales?.tax_amount || '',
        sales_order_id: editsales?.sales_order_id || '',
        sale_order_number: editsales?.sale_order_number || '',
        reference_number: editsales?.reference_number || '',
        reference_date: editsales?.reference_date || '',
        shipping_address_id: editsales?.shipping_address_id || '',
        invoice_order_number: editsales?.invoice_order_number || '',
        id: editsales?.id || '',
      },
      validationSchema: salesValidationSchema,
      onSubmit: (values) => {
        const promise = dispatch(updateSale({ id: editsales.id, saleData: values }));
        promise.then((res) => {
          if (res.payload.success) {
            toast.success(res.payload.success);
            setTimeout(() => {
              navigate('/invoice/');
            }, 1000);
          }
          if (res.payload.error) {
            toast.error(res.payload.error);
          }
        });
      },
    });
    
      const {  saleorder } = useSelector((state) => state?.sales);
      // const { customers,products, loading, error } = useSelector((state) => state?.sales);
      const [selectedShippingAddress,setSelectedShippingAddress]=useState([])
      const [filteredProducts,setFilteredProducts] = useState([])
      const matchingPurchaseOrder =  saleorder?.find((po) => formik.values.sales_order_id == po.id);
     useEffect(() => {
  const newTotal = items?.reduce((acc, item) => {
    const itemTotal = (parseFloat(item?.quantity) * parseFloat(item?.price)) || 0;
    return acc + itemTotal;
  }, 0);

  const totalTax = items?.reduce((acc, item) => {
    const itemTaxAmount = parseFloat(item?.tax_amount) || 0;
    return acc + itemTaxAmount;
  }, 0);

  const discountAmount = (newTotal * (parseFloat(formik.values.discount) || 0) / 100);
  const newGrandTotal = (newTotal - discountAmount + totalTax) || 0; // Include totalTax here
  const newPaymentBalance = newGrandTotal - (parseFloat(formik.values.paid_amount) || 0);

  setTaxAmount(totalTax);
  setTotal(newTotal);
  setGrandTotal(newGrandTotal);

  // Update Formik's field values
  formik.setFieldValue('total_exclude_tax', newTotal?.toFixed(2));
  formik.setFieldValue('grand_total', newGrandTotal?.toFixed(2));
  formik.setFieldValue('payment_balance', newPaymentBalance.toFixed(2));
  formik.setFieldValue('tax_amount', totalTax?.toFixed(2));
  formik.setFieldValue('purchase_items', items);
}, [items, formik.values.discount, formik.values.paid_amount]);

      
  
  
     // Function to remove an item from the list
     const handleDeleteItem = (index) => {
      const newItems = items?.filter((_, i) => i !== index);
      setItems(newItems);
    };
  
  
  
    useEffect(() => {
      const filter = matchingPurchaseOrder?.sale_order_items?.map((item)=>{
        const selectedProduct = products?.find(product => product.id == item?.product_id); 
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
  
      // setItems(secondfilter)
      // formik.setFieldTouched('sales_items', items);
  
    }, [formik.values. sales_order_id,  saleorder]);
    // useEffect(()=> {
    //     formik.setFieldValue(' sales_items', items); 
    //     formik.setFieldValue('total_exclude_tax', total?.toFixed(2));
    // },[])
  
  useEffect(() => {
    dispatch(setHeading("Invoice"));
    return () => {
      dispatch(clearHeading());
    };
  }, [dispatch]);
  
  const handleEditItem = (index,itemsId) => {
    const item = items?.find(data => data.id == itemsId)
    dispatch(editSaleColumn({data:item,index:index}))
    setShowEditModal(true)
   }
  
  
  const importInvoiceOrder = () =>{
    setCustomErrMsg('')
    if(formik.values.sale_order_number?.length == 11){
        const ReferensePurchase = saleorder?.find(item => (item.sale_order_number == formik.values.sale_order_number
                ))
                if(ReferensePurchase == undefined){
                return  setCustomErrMsg("Cannot find Invoice Order")
                }else{
                return   formik.setFieldValue('sales_order_id',ReferensePurchase.id)
                }
              }else{
               return setCustomErrMsg("Invoice Order Number format is Wrong")
              }
  }
  
  useEffect(() => {
    const channel = customers.find((i) => i.id == formik.values.customer_id);
    if (channel) {
      setSelectedShippingAddress(channel.shipping_addresses);
      const filteredProducts = products.map((item) => {
        const { s_rate_1, s_rate_2, s_rate_3, ...rest } = item;
        const channel_id = channel.channel_id;
        let price;
        if (channel_id == 1) {
          price = s_rate_3;
        } else if (channel_id == 2) {
          price = s_rate_2;
        } else if (channel_id == 3) {
          price = s_rate_1;
        }
        return { ...rest, price };
      });
      setFilteredProducts(filteredProducts);
    }
  }, [customers, products, formik.values.customer_id]);
  

  return (
    <div className="bg-white  p-5">
      <h2 className="text-xl font-medium mb-5 text-center">Edit Invoice</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="grid grid-cols-3 gap-5">
       
        <div className='w-full'>
        <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Venodr :</label>
        <select
            id="customer_id"
            {...formik.getFieldProps('customer_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">Select Vendor</option>
            {customers?.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </select>
        {formik.touched.customer_id && formik.errors.customer_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.customer_id}</p>
        )}
    </div>
    <div className='w-full hidden'>
        <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700">Invoice Number:</label>
        <input
          id="invoice_number"
          type="text"
          {...formik.getFieldProps('invoice_number')}
          className="mt-1 block w-full px-4 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         {formik.touched.invoice_number && formik.errors.invoice_number && (
            <p className="text-red-500 text-xs italic">{formik.errors.invoice_number}</p>
        )}
      </div>
      <div>
            <label htmlFor="shipping_address_id" className="block text-sm font-medium text-gray-700">Shipping Address:</label>
            <select
              id="shipping_address_id"
              {...formik.getFieldProps('shipping_address_id')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a Shipping Address</option>
              {selectedShippingAddress?.map(item => (
                <option key={item.id} value={item.id}>{item.address}</option>
            ))}
            </select>
            {formik.touched.shipping_address_id && formik.errors.shipping_address_id && (
              <p className="text-red-500 text-xs italic">{formik.errors.shipping_address_id}</p>
            )}
          </div>
        
        <div className="flex justify-end">

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

        <div className='hidden'>
            <label htmlFor=" invoice_number" className="block text-sm font-medium text-gray-700">Invoice Number:</label>
            <input
                id=" invoice_number"
                type="text"
                {...formik.getFieldProps(' invoice_number')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched. invoice_number && formik.errors. invoice_number && (
                <p className="text-red-500 text-xs italic">{formik.errors. invoice_number}</p>
            )}
        </div>
      
        </div>
    </div>



    <div className="grid grid-cols-3 hidden">
  <div className="">
    <label htmlFor="sale_order_number" className="block text-sm font-medium text-gray-700">Invoice Order:</label>
    <div className="flex">
      <input
        id="sale_order_number"
        type="text"
        {...formik.getFieldProps('sale_order_number')}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <div className="text-center flex items-center ml-2">
        <div onClick={importInvoiceOrder} className="flex items-center bg-blue-600 p-2 rounded-md leading-none text-center cursor-pointer">
          <LuImport className='text-white text-center' />
        </div>
      </div>
    </div>
    <div className="text-red-700 text-sm">{customErrMsg}</div>
  </div>
</div>
 

      <div className="hidden">
        <select
            id=" sales_order_id"
            
            {...formik.getFieldProps(' sales_order_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">Select Sale Order</option>
            { saleorder?.map(item => (
                <option key={item.id} value={item.id}>{item.sale_order_id}</option>
            ))}
        </select>
        {formik.touched. sales_order_id && formik.errors. sales_order_id && (
            <p className="text-red-500 text-xs italic">{formik.errors. sales_order_id}</p>
        )}

      </div>


     
     

     

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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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

                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.hsn}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.tax || 0}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.quantity}</td>
                    {/* <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.inbound || 0} </td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.outbound || 0}</td> */}
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.price}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.total}</td>
                    <td  className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.discount  || 0}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.tax_amount || 0}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.total_inc_tax ||0}</td>
                    <td className="px-6  whitespace-nowrap flex items-center gap-4 justify-center text-right text-sm font-medium">
                      <div className="flex items-center ">
                      <button type='button' onClick={() => handleEditItem(index,item.id)} className="text-primary-600 hover:text-red-900">
                      <CiEdit className='mt-5 w-6 h-5' /> &nbsp; &nbsp;
                      </button></div>
                      <button type='button' onClick={() => handleDeleteItem(index)} className="text-red-600 hover:text-red-900">
                      <AiOutlineDelete className='w-5 h-5' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
          )}
            </table>
          <div className="flex justify-center items-center py-2">
{formik.touched. sales_items && formik.errors. sales_items && (
    <p className="text-red-500 text-sm ">{formik.errors. sales_items}</p>)}
            </div>  

          </div>
        </div>
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
      value={grandTotal?.toFixed(2)}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</div>

     <div className="grid grid-cols-4 gap-3 mt-10">
       {/* payment_status Method */}
       <div className="">
       <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Payment Status:</label>

       <select
        id="payment_status"
        {...formik.getFieldProps('payment_status')}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select payment Status </option>
        <option value="full">Full</option>
        <option value="partial">Partial</option>
      </select>
      {formik.touched.payment_status && formik.errors.payment_status && (
        <div className="text-sm text-red-600">{formik.errors.payment_status}</div>
      )}
       </div>

      {/* Paid Amount - Conditional */}
      {formik.values.payment_status === 'partial'  ? (
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm"
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
</div>
<div className="grid grid-cols-4 gap-3 mt-10">

            <div>
          <label htmlFor="payment_mode" className="block text-sm font-medium text-gray-700">Payment Mode:</label>
          <select
  id="payment_mode"
  {...formik.getFieldProps('payment_mode')}
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value="">Select Transaction method</option>
  <option value="bank">Bank</option>
  <option value="cheque">Cheque</option>
  <option value="rtgs">RTGS</option>
  <option value="neft">NEFT</option>
  <option value="cash">Cash</option>
</select>

          {formik.touched.payment_mode && formik.errors.payment_mode && (
            <div className="text-sm text-red-600">{formik.errors.payment_mode}</div>
          )}
        </div>
        {formik.values.payment_mode == "bank" &&          <div>
          <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Account:</label>
          <select
  id="account_id"
  {...formik.getFieldProps('account_id')}
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value="">Select Bank Account</option>
  {paymentModes?.map((item) => (
    <option value={item.id} key={item.id}>
      {item.account_name}
    </option>
  ))}
</select>

          {formik.touched.account_id && formik.errors.account_id && (
            <div className="text-sm text-red-600">{formik.errors.account_id}</div>
          )}
        </div> }
    
        {formik.values.payment_mode === 'cheque' || formik.values.payment_mode === 'rtgs' || formik.values.payment_mode === 'neft' ? (
        <>
        <div className="">
        <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">Reference Number</label>
          <input
            type="number"
            {...formik.getFieldProps('reference_number')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Reference Number"
          />
          {formik.touched.reference_number && formik.errors.reference_number && (
            <div className="text-sm text-red-600">{formik.errors.reference_number}</div>
          )}

        </div>
        

        
          <div className="">
          <label htmlFor="reference_date" className="block text-sm font-medium text-gray-700">Reference Date:</label>

          <DatePicker
            selected={formik.values.reference_date}
            onChange={date => formik.setFieldValue('reference_date', date)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.reference_date && formik.errors.reference_date && (
            <div className="text-sm text-red-600">{formik.errors.reference_date}</div>
          )}
          </div>
        </>
      ) : null}
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
        <div className="flex justify-center my-4"><button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium leading-none py-2 px-4 rounded">
          Update Invoice
        </button></div>
        </form>
         {/* Modal for adding items */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Products to Invoice"
        id={"Add-invoice-column"}
        content={<AddItemsForm items={items} products={filteredProducts} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
        <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Invoice Items"  
        id={"edit-invoice-column"}
        content={<EditItemsForm items={items} products={filteredProducts} setItems={setItems} onClose={() => setShowEditModal(false)} />}
      />
    </div>
  );
};

export default EditSales;

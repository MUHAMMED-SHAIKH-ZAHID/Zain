import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { CiEdit } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LuImport } from "react-icons/lu";
import { format } from 'date-fns';
import { createSale, editSaleColumn } from '../../../../redux/features/SalesSlice';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';
import { editPurchaseColumn } from '../../../../redux/features/PurchaseSlice';
import Modal from '../../../../components/commoncomponents/Modal';
import AddItemsForm from './AddItemsForm';
import EditItemsForm from './EditItemsForm';
import { Select } from 'antd';






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
     created_by: Yup.string(),
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
    discount: Yup.number().min(0.01, 'Discount must be at least 1%').max(100, 'Discount must not exceed 100%'),
    tax_amount: Yup.number(),
    shipping_address_id:Yup.string().required("shipping address is required"),
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
    bank_name: Yup.string()
      .when('payment_mode', (payment_mode, schema) =>
        ['cheque', 'rtgs', 'neft'].includes(payment_mode)
          ? schema.required('Please select Reference Date')
          : schema.notRequired()
      ),
      sale_order_number: Yup.string(), // Added validation for sale_order_number

  });
  
 

const AddSale = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
 const [items, setItems] = useState([]);
 const [total, setTotal] = useState(0);
 const [grandTotal, setGrandTotal] = useState(0);
 const [taxAmount,setTaxAmount] = useState(0)
 const [customErrMsg,setCustomErrMsg] = useState('')
 const [currentCustomer,setCurrentCustomer] = useState('')
  const navigate = useNavigate()
  const [loadingMessage,setLoadingMessage] = useState(false)


  const formik = useFormik({
    initialValues: {
      sales_date: new Date(),
       invoice_number: '',
      customer_id: '',
      payment_status: 'partial',
      paid_amount: '',
      payment_balance: '',
      payment_due_date: '',
      discount: '',
      account_id: '',
      payment_mode: '',
       sales_items: [],
      notes: '',
      total_exclude_tax: '',
      grand_total: '',
      tax_amount: '',
       sales_order_id: '',
       sale_order_number: '', 
      reference_number: '',
      reference_date: '',
      shipping_address_id:'',
      invoice_order_number:'',
      bank_name:'',
      created_by:'',
    },
    validationSchema: salesValidationSchema,
    onSubmit: (values) => {
      values. sales_items = items;
      let lessquantity = false
     values.sales_items.map((item)=>{
        if(item.quantity > item.available_quantity){
          toast.warn("An Item selected more than stock quantity")
          return lessquantity = true;
        }
      
        if(item.available_quantity == 0 || item.available_quantity < 0 ){
          toast.error("An Out of Stock Item Product Selected")
          return lessquantity = true;
        }
      })
      
      if(lessquantity == true){
        return
      }
  
      let errors = {};
      
      if (!values?. sales_items?.length) {
        errors. sales_items = 'At least one item is required';
      }
      if (values.payment_mode === 'bank' && !values.account_id) {
        errors.account_id = 'Account Id is Required';
      }
      if (['rtgs', 'neft','cheque'].includes(values.payment_mode)) {
        if (!values.reference_number) {
          errors.reference_number = 'Reference Number Is Required';
        }
        if (!values.reference_date) {
          errors.reference_date = 'Reference Date Is Required';
        }
        if (!values.bank_name) {
          errors.bank_name = 'Bank Name Is Required';
        }
      }
      if (['partial'].includes(values.payment_status)) {
        if (!values.paid_amount) {
          errors.paid_amount = 'Paid amount is required';
        }
        if (!values.payment_due_date) {
          errors.payment_due_date = 'Last date is required';
        }
        if (parseFloat(values.paid_amount) < 0) {
          errors.paid_amount = 'Paid amount minimum must be one';
        }
        if (values.paid_amount > values.grand_total) {
          errors.paid_amount = 'Paid Amount Is greater than grand total';
        }
      }
      if (Object.keys(errors).length > 0) {
        formik.setErrors(errors);
        return;
      }
  
      // Format dates before submission
      const formattedValues = {
        ...values,
        sales_date: format(values.sales_date, 'yyyy-MM-dd'),
        payment_due_date: values.payment_due_date ? format(values.payment_due_date, 'yyyy-MM-dd') : null,
        reference_date: values.reference_date ? format(new Date(values.reference_date), 'yyyy-MM-dd') : null,
      };
  
      setLoadingMessage(true)
      const promise = dispatch(createSale(formattedValues))
        setLoadingMessage(true)
      promise.then((res) => {
        if (res.payload.success){
          toast.success(res.payload.success);
            navigate('/invoice/');
        }
        if (res.payload.error){
          toast.error(res.payload.error)
        }
      });
    },
  }); 
  

  const dispatch = useDispatch()
    const {  saleorder,paymentModes } = useSelector((state) => state?.sales);
    const {stocks, customers,products, loading, error } = useSelector((state) => state?.sales);
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
       
      const totalBeforeDiscount = newTotal + totalTax;
      const discountAmount = parseFloat(totalBeforeDiscount) * (parseFloat(formik.values.discount) || 0) / 100;
      const newGrandTotal = parseFloat(totalBeforeDiscount) - parseFloat(discountAmount);
      
      const newPaymentBalance = newGrandTotal - (parseFloat(formik.values.paid_amount) || 0);
    
      setTaxAmount(totalTax);
      setTotal(newTotal);
      setGrandTotal(newGrandTotal || 0);
      // Update Formik's field values
      formik.setFieldValue('total_exclude_tax', newTotal?.toFixed(2));
      formik.setFieldValue('grand_total', parseFloat(newGrandTotal?.toFixed(2)));
      formik.setFieldValue('payment_balance', newPaymentBalance?.toFixed(2));
      formik.setFieldValue('tax_amount', totalTax?.toFixed(2));
      formik.setFieldValue('purchase_items', items);
    }, [items, formik.values.discount, formik.values.paid_amount]);
    
    


   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items?.filter((_, i) => i !== index);
    setItems(newItems);
  };



  useEffect(() => {
    const filter = matchingPurchaseOrder?.items?.map((item)=>{
      const selectedProduct = products?.find(product => product.id == item?.product_id); 
      return {...item, hsn: selectedProduct?.hsn_code,tax:selectedProduct?.tax_rate}
      })
      const stockcheckfilter = stocks?.find((item) => item.product_id == filter?.product_id  )
   const secondfilter =   filter?.map((item)=>{
        const quantity = item.quantity
        const price = item.price
        const tax = item.tax
        const total = quantity * price;
        const taxAmount = total * tax / 100;
        const totalInclTax = total + taxAmount;
        
        return {...item, total : total.toFixed(2) ,tax_amount : taxAmount.toFixed(2) ,total_inc_tax : totalInclTax.toFixed(2)}
      })
      const thirdfilter = secondfilter?.map((item) => {
        const matchingStock = stocks?.find((stockitem) => item.product_id === stockitem.product_id);
      
        if (matchingStock) {
          return { ...item, stock_check: true, available_quantity: matchingStock.physical_stock };
        } else {
          return { ...item, stock_check: false, available_quantity: 0 };
        }
      });
      
    setItems(thirdfilter)
    formik.setFieldTouched(' sales_items', items);

  }, [formik.values.sales_order_id,saleorder,formik.values.sale_order_number]);


useEffect(() => {
  dispatch(setHeading("Invoice"));
  return () => {
    dispatch(clearHeading());
  };
}, [dispatch]);

const handleEditItem = (index,itemsId) => {
  const item = items?.find(data => data.product_id == itemsId)
  dispatch(editSaleColumn({data:item,index:index}))
  setShowEditModal(true)
 }


const importInvoiceOrder = () =>{
  setCustomErrMsg('')
  if(formik.values.sale_order_number){
    console.log(formik.values.sale_order_number.charAt(formik.values.sale_order_number.length-1) == ' ',"debuggin ")
    if(formik.values.sale_order_number.charAt(formik.values.sale_order_number.length-1) == ' '){
      console.log("inside the  invoice")
      const new_sale_order_number = formik.values.sale_order_number.slice(0,-1)
        formik.setFieldValue("sale_order_number", new_sale_order_number)
    }
    console.log(formik.values.sale_order_number,"dyeah i s aio fa dyeah")
      const ReferensePurchase = saleorder?.find(item => (item.sale_order_number == formik.values.sale_order_number
              ))
              if(ReferensePurchase?.customer_id != formik.values.customer_id || formik.values.customer_id == ''){
                // return  setCustomErrMsg("You can only import your Invoice order")
                formik.setFieldValue('customer_id',ReferensePurchase?.customer_id)
                setCurrentCustomer(ReferensePurchase?.customer_id)
                formik.setFieldValue('shipping_address_id',ReferensePurchase?.shipping_address_id)
                formik.setFieldValue('created_by',ReferensePurchase?.created_by)
              }
              if(ReferensePurchase == undefined){
              return  setCustomErrMsg("Cannot find Invoice Order")
              }else{
              return   formik.setFieldValue('sales_order_id',ReferensePurchase.id)
              }
            }else{
             return setCustomErrMsg("Invoice Order Number format is Wrong")
            }
}

useEffect(()=>{
  const channel = customers?.find((i)=> i.id == formik.values?.customer_id)
  if(channel){
    setSelectedShippingAddress(channel.shipping_addresses)
    const filteredProducts = products?.map((item) => {
      const {  s_rate_1, s_rate_2, s_rate_3, ...rest } = item;  // Destructure to get the rates and other fields
      const channel_id = channel.channel_id
       let price;
    
      if (channel_id == 1) {
        price = s_rate_3; 
      } else if (channel_id == 2) {
        price = s_rate_2;  
      } else if (channel_id == 3) {
        price = s_rate_1; 
      }
    
      return {
        ...rest,  // Include other fields
        price,    // Add the new price field
      };
    });
    setFilteredProducts(filteredProducts)
  }
},[items,customers,formik.values.customer_id])
 
  return (
    <div className="bg-white  p-5">
      <h2 className="text-xl font-medium mb-5 text-center">Create Invoice</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="grid grid-cols-3 gap-5">
       
        <div className='w-full'>
        <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Company :</label>
        <Select
									showSearch
									style={{ width: '100%' }}
									onChange={e => {
                    formik.setFieldValue('customer_id',e)
									}}
                  defaultValue={formik.values?.customer_id}
                  value={customers.find(item => item.id == formik.values.customer_id)?.company_name}
									placeholder='Select a Company'
									optionFilterProp='children'
									filterOption={(input, option) =>
										option.props.children
											.toLowerCase()
											.indexOf(input?.toLowerCase()) >= 0
									}
								>
									{customers?.map(item => (
										<Select.Option key={item.id} value={item.id}>
											{item.company_name}
										</Select.Option>
									))}
								</Select>
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
            <label htmlFor=" invoice_number" className="block text-sm font-medium text-gray-700">Purchase ID:</label>
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



    <div className="grid grid-cols-3">
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
            <option value="">Select Purchase Order</option>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Qty</th>
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
<td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':''}`}>
  {
    products?.find(pro => pro.id == item?.product_id)?.product_name || item?.product_id
  }
</td>

<td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':''}`}>{item?.hsn}</td>
                    <td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':''}`}>{item?.tax || 0}</td>
                    <td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':''}`}>{item?.quantity}</td>
                    <td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':item.available_quantity < item.quantity ? 'text-orange-300':'' }`}>{item?.available_quantity}</td>
                    {/* <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.inbound || 0} </td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.outbound || 0}</td> */}
                    <td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':''}`}>{item?.price}</td>
                    <td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':''}`}>{item?.total}</td>
                    <td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':''}`}>{item?.discount  || 0}</td>
                    <td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':''}`}>{item?.tax_amount || 0}</td>
                    <td className={`px-6  whitespace-nowrap text-sm text-gray-500 ${item.available_quantity == 0 ? 'text-red-400':''}`}>{item?.total_inc_tax ||0}</td>
                    <td className="px-6  whitespace-nowrap flex items-center gap-4 justify-center text-right text-sm font-medium">
                      <div className="flex items-center ">
                      <button type='button' onClick={() => handleEditItem(index,item.product_id)} className="text-primary-600 hover:text-red-900">
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
      value={taxAmount?.toFixed(2)}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
  {/* Discount Input */}
  <div>
    <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%):</label>
    <input
      id="discount"
      type='number'
      {...formik.getFieldProps('discount')}
      className="mt-1 no-number-spin block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
      value={grandTotal?.toFixed(2)}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</div>

     <div className="grid grid-cols-4 gap-3 mt-10">
       {/* payment_status Method */}
       <div className="hidden">
       <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Payment Status:</label>

       <select
        id="payment_status"
        {...formik.getFieldProps('payment_status')}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select payment Status </option>
        <option value="full">Full</option>
        <option defaultChecked value="partial">Partial</option>
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
        <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700">Bank Name</label>
          <input
            type="text"
            {...formik.getFieldProps('bank_name')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Bank Name"
          />
          {formik.touched.bank_name && formik.errors.bank_name && (
            <div className="text-sm text-red-600">{formik.errors.bank_name}</div>
          )}

        </div>
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
        <div className="flex justify-center my-4">   <button
        disabled={loadingMessage}
          type="submit"
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loadingMessage ? "animate-pulse" : ''}`}
        >
         {loadingMessage ? 'Creating  Invoice...': 'Create Invoice' }
        </button>
        </div>
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
        title="Edit Items to Invoice"  
        id={"edit-Purchase-column"}
        content={<EditItemsForm items={items} products={filteredProducts} setItems={setItems} onClose={() => setShowEditModal(false)} />}
      />
    </div>
  );
};

export default AddSale;

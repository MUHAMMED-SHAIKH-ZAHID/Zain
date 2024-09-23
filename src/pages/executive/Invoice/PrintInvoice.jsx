import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import { useNavigate } from 'react-router-dom';
import { LuImport } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';





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
        [ 'partial'].includes(payment_status)
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
    bank_name: Yup.string()
      .when('payment_mode', (payment_mode, schema) =>
        ['cheque', 'rtgs', 'neft'].includes(payment_mode)
          ? schema.required('Please select Reference Date')
          : schema.notRequired()
      ),
      sale_order_number: Yup.string(), // Added validation for sale_order_number

  });


const PrintInvoice = () => {
  const dispatch = useDispatch()
    const { customers,viewsalesdata,products,paymentModes, loading, error } = useSelector((state) => state?.sales);



    const [items, setItems] = useState(viewsalesdata?.sales_items);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)

    const [customErrMsg,setCustomErrMsg] = useState('')
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
    
    
    const formik = useFormik({
      initialValues: {
        sales_date: viewsalesdata?.sales_date || new Date(),
        invoice_number: viewsalesdata?.invoice_number || '',
        customer_id: viewsalesdata?.customer_id || '',
        payment_status: viewsalesdata?.payment_status || '',
        paid_amount: viewsalesdata?.paid_amount || '',
        payment_balance: viewsalesdata?.payment_balance || '',
        payment_due_date: viewsalesdata?.payment_due_date || '',
        discount: viewsalesdata?.discount || '',
        account_id: viewsalesdata?.account_id || '',
        payment_mode: viewsalesdata?.payment_mode || '',
        sales_items: viewsalesdata?.sales_items || [],
        notes: viewsalesdata?.notes || '',
        total_exclude_tax: viewsalesdata?.total_exclude_tax || '',
        grand_total: viewsalesdata?.grand_total || '0',
        tax_amount: viewsalesdata?.tax_amount || '',
        sales_order_id: viewsalesdata?.sales_order_id || '',
        sale_order_number: viewsalesdata?.sale_order_number || '',
        reference_number: viewsalesdata?.reference_number || '',
        reference_date: viewsalesdata?.reference_date || '',
        shipping_address_id: viewsalesdata?.shipping_address_id || '',
        invoice_order_number: viewsalesdata?.invoice_order_number || '',
        id: viewsalesdata?.id || '',
        bank_name: viewsalesdata?.bank_name || '',
      },      
        validationSchema: salesValidationSchema,
        onSubmit: (values) => {
         
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
        const newGrandTotal = (newTotal - discountAmount ) || 0;
        const newPaymentBalance = newGrandTotal - (parseFloat(formik.values.paid_amount) || 0);
      
        setTaxAmount(totalTax);
        setTotal(newTotal);
        setGrandTotal(viewsalesdata?.grand_total);
      
        // Update Formik's field values
        formik.setFieldValue('total_exclude_tax', newTotal?.toFixed(2));
        // formik.setFieldValue('grand_total', newGrandTotal?.toFixed(2));
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
      const filter = matchingPurchaseOrder?.purchase_order_items?.map((item)=>{
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
      formik.setFieldTouched(' sales_items', items);
  
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
          price = s_rate_1;
        } else if (channel_id == 2) {
          price = s_rate_2;
        } else if (channel_id == 3) {
          price = s_rate_3;
        }
        return { ...rest, price };
      });
      setFilteredProducts(filteredProducts);
    }
  }, [customers, products, formik.values.customer_id]);
  

  return (
    <div ref={componentRef} className="bg-white  p-5">
      <h2 className="text-xl font-medium mb-5 text-center"> Invoice</h2>

      <form onSubmit={formik.handleSubmit} className="">
      <div className="grid grid-cols-[3fr,3fr,1fr] text-[.5rem] md:text-[0.9rem] border border-b-0">
      <div className="border-r">
        <div className="grid gap-1 p-2">
          <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">Regt Name</div>
          <div className="uppercase justify-start">Gnidertron Private </div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">Address</div>
          <div className="justify-start flex">No. 57/1003-C ,Near Abu Haji Auditorium ,Kundungal Park, Pilakandi Road Kozhikode</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">Pin</div>
          <div className="justify-start flex">673003</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">State Code</div>
          <div className="justify-start flex">32</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">GST</div>
          <div className="justify-start uppercase flex">32aalcg2360h1zt</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">CIN</div>
          <div className="justify-start flex">U46490KL2024PTC087587</div>
          </div>
        </div>
    

        <div className="border w-full p-3">
        <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">Sales Executive:</div>
          <div className="justify-start flex">{viewsalesdata?.created_by}</div>
          </div>
        <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">Invoice Order Number:</div>
          <div className="justify-start flex">{viewsalesdata?.invoice_order_number}</div>
          </div>
        </div>
      </div>
      <div className="border ">
        <div className="p-1">

        <div className="grid grid-cols-2 py-1 justify-between">
          <div className="uppercase">Company Name</div>
          <div className="justify-start flex">{viewsalesdata?.customer?.company_name}</div>
          </div>
      <div className="grid grid-cols-2 py-1 justify-between">
          <div className="uppercase">Address</div>
          <div className="justify-start py-1 flex">{viewsalesdata?.customer?.address}</div>
          </div>
      <div className="grid grid-cols-2 py-1 justify-between">
          <div className="uppercase">State Code</div>
          <div className="justify-start flex">{viewsalesdata?.customer?.gst?.slice(0,2)}</div>
          </div>
      <div className="grid grid-cols-2 py-1 justify-between">
          <div className="uppercase">Gst Number</div>
          <div className="justify-start flex">{viewsalesdata?.customer?.gst}</div>
          </div>
      <div className="grid grid-cols-2 py-1 justify-between">
          <div className="uppercase">Pan Number</div>
          <div className="justify-start flex">{viewsalesdata?.customer?.pan}</div>
          </div>
        </div>
   
      <div className="border-t w-full">
        <div className="grid grid-cols-[2fr,6fr] p-1" >
        <div className="gap-1 grid ">
          <div className="uppercase">Route</div>
          <div className="uppercase">DL.NO</div>
        </div>
        <div className="grid gap-1 pl-10 ">
        
          <div className="uppercase"></div>
          <div className="justify-start flex"></div>
        </div>
      </div>
        </div>
      </div>
         <div className="border">
        <div className="font-medium pt-2 text-center">INVOICE NO</div>
        <div className="font-normal pt-1 text-center uppercase">{viewsalesdata?.invoice_number}</div>
        <div className="border flex justify-between">
          <div className="p-1">DATE</div>
          <div className="text-start flex p-1">&nbsp; : &nbsp;{viewsalesdata?.invoice_date}</div>
        </div>
      </div>
    </div>

      {/* Items Table */}
        <div className="">
          <div className="">

            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">HSN</th>
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  {/* <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">physical</th>
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Exbound</th> */}
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Total Incl Tax</th>
                </tr>
              </thead>
              {items?.length > 0 && (

              <tbody className="bg-white divide-y divide-gray-200">
                {items?.map((item, index) => (
                  <tr key={index}>
<td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">
  {
    products?.find(pro => pro.id == item?.product_id)?.product_name || item?.product_id
  }
</td>

                    <td className="px-6 py-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.hsn}</td>
                    <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.tax || 0}</td>
                    <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.quantity}</td>
                    {/* <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.inbound || 0} </td>
                    <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.outbound || 0}</td> */}
                    <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.price}</td>
                    <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.total}</td>
                    <td  className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.discount  || 0}</td>
                    <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.tax_amount || 0}</td>
                    <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.total_inc_tax ||0}</td>
                 
                  </tr>
                ))}
              </tbody>
          )}
            </table>
            <div className="flex gap-4 justify-end mt-5 md:text-sm text-[.7rem] mr-5">
{/* Total Display */}
 <div className='grid gap-2'>
      <label htmlFor="total_exclude_tax" className="block text-md font-medium ">Total Exclude Tax</label>
      <label htmlFor="tax_amount" className="block text-md font-medium text-gray-700"> Total Tax</label>
      <label htmlFor="discount" className="block text-md font-medium text-gray-700">Discount </label>
      <label htmlFor="grandTotal" className="block text-md font-medium text-gray-700">Grand Total</label>
    </div>


{/* Grand Total TAx */}
<div className='grid'>
  <div className="">
      :₹ {formik?.values?.total_exclude_tax}
  </div>
  <div className="">

  :₹ {formik.values.tax_amount}
  </div>
  <div className="">
  : {formik?.values?.discount} %
  </div>
  <div className="">
  :₹ {formik?.values?.grand_total}
  </div>
</div>
{/* Discount Input */}

</div>


       

          </div>
        </div>
        <table className="min-w-full divide-y mt-5 divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                {formik.values.payment_status === 'partial' ? (
      <>
                                  <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th></>):<></>}

                <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Balance Amount</th>
                <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                {formik.values.payment_mode === 'cheque' || formik.values.payment_mode === 'rtgs' || formik.values.payment_mode === 'neft' ? (
      <>
                      <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                      <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Referense Number</th>

                      </>):<></>}
                      {formik.values.payment_mode == "bank" &&  
                <th scope="col" className="px-6 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Account</th> }
              </tr>
            </thead>
            {items?.length > 0 && (

            <tbody className="bg-white divide-y divide-gray-200">
            
                <tr className='border uppercase'>


                  <td className="px-6 py-4  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{formik.values.payment_status}</td>
                  {formik.values.payment_status === 'partial' ? (
      <>
                  <td className="px-6 py-4  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{formik.values.paid_amount}</td></>):<></>}
                  <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{formik.values.payment_balance}</td>
                  <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{formik.values.payment_due_date}</td>
                  <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{formik.values.payment_mode}</td>
                  {formik.values.payment_mode === 'cheque' || formik.values.payment_mode === 'rtgs' || formik.values.payment_mode === 'neft' ? (
      <>
                                      <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{formik.values.reference_number}</td>


                      </>):<></>}
                  {formik.values.payment_mode === 'cheque' || formik.values.payment_mode === 'rtgs' || formik.values.payment_mode === 'neft' ? (
      <>
                                      <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{formik.values.reference_number}</td>


                      </>):<></>}
                      {formik.values.payment_mode == "bank" &&  
                  <td className="px-6  whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{paymentModes?.find(item => item.id == formik.values.account_id)?.account_name}</td>}

                </tr>
          
            </tbody>
        )}
          </table>
          {formik.values.notes &&
      
      <div className='my-6'>
        <label htmlFor="notes" className="block md:text-xs text-[.5rem] font-medium text-gray-700 underline">Notes</label>
      <div className="">{formik?.values?.notes}</div>
      </div>
      }

        {showPrint && (

<div className="flex justify-center my-4 pb-10">   <button onClick={handlePrintfun} type="submit" className="bg-blue-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
  Print Invoice
</button>

</div>
)}
        </form>
    </div>
  );
};

export default PrintInvoice;

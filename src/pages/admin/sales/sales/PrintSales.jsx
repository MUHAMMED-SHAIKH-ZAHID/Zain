import { useEffect, useRef, useState } from 'react';
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
import { useReactToPrint } from 'react-to-print';
import logo from '../../../../../public/images/logo.png'
import { numberToWords } from '../../../../components/commoncomponents/numbertowords';


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


const PrintSales = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const { customers,viewsalesdata,products,paymentModes, loading, error } = useSelector((state) => state?.sales);

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

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
            const promise =   dispatch(updateSale({ id: viewsalesdata.id, saleData: values }))
            promise.then((res) => {
              if (res.payload.success){
                toast.success(res.payload.success);
                setTimeout(() => {
                  navigate('/invoice/');
                }, 1000);
              }
              if (res.payload.error){
                toast.error(res.payload.error)
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
    <div className="grid grid-cols-3 items-end">
        <div className="">
      <img src={logo} alt="" className='h-16 leading-none' />

        </div>
        <div className="grid justify-items-center">
                      <div className="text-xl font-medium justify-center flex items-end leading-none pb-3"> Invoice</div>
          <div className="">{viewsalesdata?.invoice_number}</div>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className="">
      <div className="grid grid-cols-[2fr,3fr,1fr] text-[.5rem] md:text-[0.8rem] border border-black border-b-0">
      <div className="border-r-2  border-black">
        <div className="grid gap-1 p-2">
          <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">Regt Name</div>
          <div className="uppercase justify-start">Gnidertron Private </div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="uppercase">Address</div>
          <div className="justify-start flex">No. 57/1003-C ,Near Abu Haji Hall </div>
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
          <div className="uppercase">Pan</div>
          <div className="justify-start flex">AALCG2360H</div>
          </div>
        </div>
    

    
      </div>
      <div className="border-r-2 grid grid-cols-[3fr,1fr,2fr] border-black">
        <div className="p-1">

      <div className="grid grid-cols-[2fr,6fr]  justify-between">
          <div className="uppercase">Company </div>
          <div className="justify-start flex">{viewsalesdata?.customer?.company_name}</div>
          </div>
      <div className="grid grid-cols-[2fr,6fr] justify-between">
          <div className="uppercase">Address</div>
          <div className="justify-start  flex">{viewsalesdata?.customer?.address}</div>
          </div>
      <div className="grid grid-cols-[2fr,6fr] justify-between">
          <div className="uppercase">pin</div>
          <div className="justify-start  flex">{viewsalesdata?.customer?.pin_code}</div>
          </div>
      <div className="grid grid-cols-[2fr,6fr] justify-between">
          <div className="uppercase">State Code</div>
          <div className="justify-start flex">{viewsalesdata?.customer?.gst?.slice(0,2)}</div>
          </div>
      <div className="grid grid-cols-[2fr,6fr] justify-between">
          <div className="uppercase">Gst </div>
          <div className="justify-start flex">{viewsalesdata?.customer?.gst}</div>
          </div>
      <div className="grid grid-cols-[2fr,6fr] justify-between">
          <div className="uppercase">Pan </div>
          <div className="justify-start flex">{viewsalesdata?.customer?.pan}</div>
          </div>
        </div>
        <div className=""></div>
        <div className="p-1">

      <div className="grid grid-cols-2  justify-between">
          <div className="uppercase">Code </div>
          <div className="justify-start flex">{viewsalesdata?.customer?.code}</div>
          </div>
      <div className="grid grid-cols-2  justify-between">
          <div className="uppercase">contact No:</div>
          <div className="justify-start  flex">{viewsalesdata?.customer?.phone }</div>
          </div>
 
        </div>
 
      </div>
      
         <div className="border border-black">
        <div className="font-medium pt-2 text-center">INVOICE NO</div>
        <div className="font-normal pt-1 text-center uppercase">{viewsalesdata?.invoice_number}</div>
        <div className="border border-x-0 border-black flex justify-between">
          <div className="p-1">DATE</div>
          <div className="text-start flex p-1">&nbsp; : &nbsp;{viewsalesdata?.invoice_date}</div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-[2fr,3fr,1fr] text-[.5rem] md:text-[0.8rem] border border-black ">
      <div className="grid grid-cols-[2fr,2fr] ">    <div className="flex gap-2">
          <div className="uppercase">DSE:</div>
          <div className="justify-start flex">{viewsalesdata?.created_by}</div>
          </div>
          <div className="flex gap-2">
          <div className="capitalize">Number:</div>
          <div className="justify-start flex">9567987408</div>
          </div></div>
      <div className="border-x-2 grid grid-cols-2 border-black">
        <div className="border-r-2 border-black"></div>
        <div className="grid grid-cols-2">
          <div className="">SO Date:&nbsp; {viewsalesdata?.sale_order_date}</div>
          <div className="">Del veh:</div>
        </div>
      </div>
      <div className=""></div>
    </div>
  
  <table className="min-w-full divide-y mt-3 divide-gray-200 border-black border">
      <thead className="">
        <tr>
          <th scope="col" className="px-2 py-1 text-cneter md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider border-black border w-1/3">Particulars</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Psc</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Gross Amt</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Sch Amt</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Oth Disc Amt</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Taxable Amt</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Tax Amt</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Net Payable</th>
        </tr>
      </thead>
      {viewsalesdata?.sales_items?.map((item, index) => (
                  <tr key={index}>


                    <td className="px-6 text-center whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">CGST {(parseInt(item?.tax)/2).toFixed(2)} + SGST {(parseInt(item?.tax)/2).toFixed(2)  || 0}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.quantity}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.price}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">0</td>
                    <td  className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.discount  || 0}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.total}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.tax_amount || 0}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.total_inc_tax ||0}</td>
                 
                  </tr>
                ))}
                <tr >


<td className="px-6 text-center whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">Total</td>

<td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{items?.reduce((acc, item) => parseInt(acc) + parseInt(item.quantity), 0)}</td>
<td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{items?.reduce((acc, item) => parseInt(acc) + parseFloat(item.price), 0).toFixed(2)}</td>
<td  className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">0</td>
<td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{items?.reduce((acc, item) => parseInt(acc) + parseFloat(item.discount), 0).toFixed(2)}</td>
<td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{items?.reduce((acc, item) => parseInt(acc) + parseFloat(item.total), 0).toFixed(2)}</td>
<td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{items?.reduce((acc, item) => parseInt(acc) + parseFloat(item.tax_amount), 0).toFixed(2)}</td>
<td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{items?.reduce((acc, item) => parseInt(acc) + parseFloat(item.total_inc_tax), 0).toFixed(2)}</td>
</tr>
   
    </table>

<table className="min-w-full divide-y mt-3 divide-gray-200 border-black border">
      <thead className="">
        <tr>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Sl No.</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">HSN</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">ITEM Name</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">MRP</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Qty</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Price</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Gross</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Disc</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Taxable</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Gst %</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Gst</th>
          <th scope="col" className="px-2 py-1 text-left md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border">Net</th>
        </tr>
      </thead>
      {viewsalesdata?.sales_items?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{index + 1}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.hsn}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{products?.find(pro => pro.id == item?.product_id)?.product_name || item?.product_id}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.mrp  || 0}</td>
                    <td  className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.qty  || 0}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.price}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.total || 0}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.discount ||0}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.total ||0}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.tax ||0}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.tax_amount ||0}</td>
                    <td className="px-6 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border">{item?.total_inc_tax ||0}</td>
                 
                  </tr>
                ))}
          
   
    </table>

    <div className="grid text-sm gap-2 pt-4 justify-items-center">
              <div className="flex font-medium gap-5">
                <div className="">Total</div>
                <div className="">{items?.reduce((acc, item) => parseInt(acc) + parseFloat(item.total_inc_tax), 0).toFixed(2)}</div>
              </div>
              <div className="flex font-medium gap-5">
                <div className="">Amount In Words</div>
                <div className="">{numberToWords(items?.reduce((acc, item) => parseInt(acc) + parseFloat(item.total_inc_tax), 0).toFixed(2))}</div>
              </div>
            </div>

            <div className="grid grid-cols-[5fr,1fr] border-black border">
              <div className="grid">
                <div className="border-black border-b-2 flex justify-center items-end uppercase text-[.7rem]  font-medium h-5">Digital Signature Date</div>
                <div className="h-16">
                  <div className="text-center uppercase underline text-[.6rem] font-medium pt-1">Terms and Conditions</div>
                  <div className="uppercase text-[.6rem] ">All Legal Disputes Subject to Calicut Only</div>
                </div>
              </div>
              <div className="border-black border-l-2  ">
                <div className="border-black border-b-2 h-5"></div>
              </div>
            </div>
            <div className="grid grid-cols-[5fr,1fr] border-black border mt-8 text-[.7rem]">
              <div className="grid">
                <div className="border-black border-b-2 flex justify-center items-end  text-[.7rem]  font-medium h-5">Aknowledgement of Goods Recieved & Dues  </div>
                <div className="">
                  <div className="grid grid-cols-2 border-black border border-t-0">
                    <div className="font-medium">To : Gnidetron Private Limited</div>
                    <div className="grid grid-cols-[1fr,3fr]">

                    <div className="border-black border-x">From Customer</div>
                    <div className=""></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-black border border-t-0">
                    <div className="font-medium"></div>
                    <div className="grid grid-cols-[1fr,3fr]">

                    <div className="border-black border-l">Route : &nbsp; 0</div>
                    <div className=""></div>
                    </div>
                  </div>
                    <table className="min-w-full divide-y divide-gray-200 ">
      <thead className="">
        <tr>
          <th scope="col" className="px-2 py-1 text-center md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border-t-0 border-l-0 border">Invoice Number.</th>
          <th scope="col" className="px-2 py-1 text-center md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border-t-0 border-l-0 border">Customer Code</th>
          <th scope="col" className="px-2 py-1 text-center md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border-t-0 border-l-0 border">Invoice Date</th>
          <th scope="col" className="px-2 py-1 text-center md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider border-black border-t-0 border-l-0 border">Invoice Amt</th>
          <th scope="col" className="px-2 py-1 text-center md:text-xs text-[.5rem] font-medium text-gray-500  tracking-wider ">Balance</th>
        </tr>
      </thead>
    
                  <tr >
                    <td className="px-6 text-center whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border border-l-0 border-b-0">{viewsalesdata?.invoice_number} </td>
                    <td className="px-6 text-center whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border border-l-0 border-b-0">{viewsalesdata?.code}</td>
                    <td className="px-6 text-center whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border border-l-0 border-b-0">{viewsalesdata?.invoice_date}</td>
                    <td className="px-6 text-center whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border border-l-0 border-b-0">{viewsalesdata?.grand_total}</td>
                    <td className="px-6 text-center whitespace-nowrap md:text-xs text-[.5rem] text-gray-500 border-black border-t-2 ">{viewsalesdata?.supplier_balance}</td>
                 
                  </tr>
          
   
    </table>
                  
                </div>
              </div>
              <div className="border-black border-l-2  ">
                <div className="border-black border-b-2 h-5 uppercase font-medium text-[.6rem] flex justify-center items-end">Signature And Stamp</div>
              </div>
            </div>



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

export default PrintSales;

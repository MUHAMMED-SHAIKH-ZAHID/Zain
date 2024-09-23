import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { updatePurchasequotation } from '../../../redux/features/PurchaseQuotationSlice';
import Modal from '../../../components/commoncomponents/Modal';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import { format } from 'date-fns'; // make sure to import the date-fns library
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { editPurchaseColumn } from '../../../redux/features/PurchaseSlice';
import AddInvoiceOrderItemsForm from './AddInvoiceOrderItemsForm';
import EditItemInvoiceOrderForm from './EditItemInvoiceOrderForm';
import { useReactToPrint } from 'react-to-print';


const itemSchema = Yup.object().shape({
  comment: Yup.string(),
  mrp: Yup.number()
    .min(1, 'MRP must be at least 1')
    .required('MRP is required')
    .when('price', (price, schema) => {
      return schema.min(price, 'MRP must be equal to or greater than the purchase price');
    }),
  price: Yup.number().min(1, 'Purchase price must be at least 1').required('Purchase price is required'),
  product_id: Yup.string().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  total: Yup.number(),
});
    
  
const purchaseValidationSchema = Yup.object({
  quotation_date: Yup.date().required('Invoice Order date is required'),
  purchase_order_number: Yup.string(),
  customer_id: Yup.string().required('Customer is required'),
  notes: Yup.string(),
  quotation_items: Yup.array().of(itemSchema).min(1, 'Please add at least 1 item to create the order'),
  grand_total: Yup.number().required('Grand total is required'),
  expected_delivery_date: Yup.date().required('Expected delivery date is required'),
  payment_terms: Yup.string().required('Payment terms are required'),
  shipping_address_id: Yup.string().required('Shipping Address  are required'),
}); 

const ViewSalesQuotation = () => {
  const dispatch = useDispatch()
  const navigate= useNavigate()
    const { customers,viewSales,products, loading, error } = useSelector((state) => state?.executiveSalesOrder);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPrint,setShowPrint] = useState(true)

    const [items, setItems] = useState(viewSales?.items || []);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)
    const [selectedShippingAddress,setSelectedShippingAddress]=useState([])
    const [filteredProducts,setFilteredProducts] = useState([])

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
  
    const calculateGrandTotal = () => {
      const total = items.reduce((acc, item) => acc + parseFloat(item.total_inc_tax || 0), 0);
      setGrandTotal(total);
      formik.setFieldValue('grand_total', total);
      formik.setFieldValue('quotation_items', items);
    };
  
    useEffect(() => {
      dispatch(setHeading('Invoice Order'));
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
  
    const handleEditItem = (index, itemId) => {
      const item = items.find((data) => data.id == itemId);
      dispatch(editPurchaseColumn({ data: item, index }));
      setShowEditModal(true);
    };
    
    const formik = useFormik({
      initialValues: {
        quotation_date: viewSales?. quotation_date || '',
        purchase_order_number: viewSales?.purchase_order_number || '',
        customer_id:  viewSales?.customer_id || '',
        quotation_items: viewSales?.items || [],
        notes:  viewSales?.notes || '',
        grand_total: viewSales?.grand_total || '',
        expected_delivery_date:  viewSales?.expected_delivery_date || '',
        payment_terms:  viewSales?.payment_terms || '',
        shipping_address_id: viewSales?.shipping_address_id || '',
      },
      validationSchema: purchaseValidationSchema,
      onSubmit: (values) => {
        values.quotation_items = items;
        values.grand_total = grandTotal;
     
  
        // Format dates before submission
        values.quotation_date = format(values.quotation_date, 'yyyy-MM-dd');
        values.expected_delivery_date = format(values.expected_delivery_date, 'yyyy-MM-dd');
  
        const promise =dispatch(updatePurchasequotation({ id: viewSales.id, purchaseData: values }))

  
  
        promise
          .then((res) => {
            if (res.payload.success) {
              toast.success(res.payload.success);
              setTimeout(() => {
                navigate('/purchase/order');
              }, 2000);
            }
            if (res.payload.error) {
              toast.error(res.payload.error);
            }
          
          })
          .catch((error) => {
            toast.error(error.message);
          });
      },
    });
   
    useEffect(()=>{
      const channel = customers.find((i)=> i.id == formik.values.customer_id)
      if(channel){
        setSelectedShippingAddress(channel.shipping_addresses)
        const filteredProducts = products.map((item) => {
          const {  s_rate_1, s_rate_2, s_rate_3, ...rest } = item;  // Destructure to get the rates and other fields
          const channel_id = channel.channel_id
           let price;
        
          if (channel_id == 1) {
            price = s_rate_1;  // Use s_rate_1 for channel_id 1
          } else if (channel_id == 2) {
            price = s_rate_2;  // Use s_rate_2 for channel_id 2
          } else if (channel_id == 3) {
            price = s_rate_3;  // Use s_rate_3 for channel_id 3
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
    <div ref={componentRef} className="px-2 md:px-4 p-4 bg-white no-scrollbar">
    <h2 className="text-lg font-medium  my-2 text-center"> Invoice Order</h2>
    <form onSubmit={formik.handleSubmit} className="">
    <div className="grid grid-cols-[3fr,3fr,2fr] text-[.5rem] md:text-[0.9rem] border border-b-0">
      <div className="">
      <div className="grid  grid-cols-[2fr,6fr] p-1" >
        <div className="gap-1 grid ">
          <div className="uppercase">Regt Name</div>
          <div className="uppercase">Address</div>
          <div className="uppercase">Pin code</div>
          <div className="uppercase">GST No</div>
          <div className="uppercase">Phone</div>
          <div className="uppercase">email</div>


        </div>
        <div className="grid gap-1 pl-10 ">
        
          <div className="uppercase">Gnidetron Private Limited</div>
          <div className="justify-start flex">No. 57/1003-C ,Near Abu Haji Hall</div>
          <div className="uppercase justify-start flex">673003</div>
          <div className="uppercase">32aalcg2360h1zt</div>
          <div className="uppercase">+91 6238492918</div>
          <div className="">office@gnidetron.com</div>
        </div>
      </div>

        <div className="border w-full">
        <div className="grid grid-cols-[4fr,4fr] p-1" >
        <div className="gap-1 grid ">
          <div className="uppercase">Invoice Order NO</div>
          <div className="">&nbsp;</div>
        </div>
        <div className="grid gap-1 pl-10 ">
        
          <div className="justify-start flex">{viewSales?.sale_order_number}</div>
          <div className=""></div>
        </div>
      </div>
        </div>
      </div>
      <div className="border">
      <div className="grid  pl-2 p-1 grid-cols-[2fr,3fr]" >
        <div className="gap-1 grid ">
          <div className="uppercase">Customer Name</div>
          <div className="uppercase">Address</div>
          <div className="uppercase">GST Number</div>
          <div className="uppercase">Pan Number</div>
          <div className="uppercase">Shipping Address</div>
        </div>
        <div className="grid gap-1 pl-10">
        
          <div className="uppercase">{viewSales?.customer_name}</div>
          <div className="justify-start flex">{viewSales?.customer_address}</div>
          <div className="uppercase">{viewSales?.gst_number}</div>
          <div className="uppercase">{viewSales?.pan_number}</div>
          <div className="uppercase">{viewSales?.shipping_address}</div>

        </div>
      
      </div>   
   
      </div>
    <div className="border">
    <div className="grid  grid-cols-2 p-1" >
        <div className="gap-1 grid ">
          <div className="uppercase">Sales Executive</div>
          <div className="uppercase">Phone Number </div>
          <div className="uppercase">email</div>
          <div className="uppercase">Date</div>
   


        </div>
        <div className="grid gap-1 pl-10 ">
        
          <div className="uppercase">{viewSales?.created_by}</div>
          <div className="justify-start flex">{viewSales?.contact}</div>
          <div className=" justify-start flex">{viewSales?.customer_email}</div>
          <div className="uppercase justify-start flex">{viewSales?.quotation_date}</div>
   
        </div>
      </div>
    </div>
    </div>
  

      {/* Items Table */}
      <div className="">
        <div className="">
          <div className=" flex justify-end">
          </div>
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">HSN</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Total Incl Tax</th>
                <th scope="col" className="px-2 md:px-4 py-3 text-left md:text-xs text-[.5rem] font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              </tr>
            </thead>
            {items?.length > 0 && (
              <tbody className="bg-white divide-y divide-gray-200">
                {items?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 md:px-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">
                      {products?.find((pro) => pro.id == item?.product_id)?.product_name || item?.product_id}
                    </td>
                    <td className="px-2 md:px-4 py-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.hsn}</td>
                    <td className="px-2 md:px-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.tax || 0}</td>
                    <td className="px-2 md:px-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.quantity}</td>
                    <td className="px-2 md:px-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.price}</td>
                    <td className="px-2 md:px-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.total}</td>
                    <td className="px-2 md:px-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.discount || 0}</td>
                    <td className="px-2 md:px-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.tax_amount || 0}</td>
                    <td className="px-2 md:px-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">{item?.total_inc_tax || 0}</td>
                    <td className="px-2 md:px-4 whitespace-nowrap md:text-xs text-[.5rem] text-gray-500">
                    {item?.comment?.length > 25 ? item?.comment?.slice(0, 25) + '...' : item?.comment }
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          <div className="flex justify-center items-center py-2">
            {formik.touched.quotation_items && formik.errors.quotation_items && (
              <p className="text-red-500 md:text-xs text-[.5rem]">{formik.errors.quotation_items}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 justify-end mt-5">
        {/* Grand Total Display */}
        <div className="flex justify-between items-center gap-10 mx-2">
          <div>
            <label htmlFor="grandTotal" className="block md:text-xs text-[.5rem] font-medium text-gray-700">Grand Total:</label>
          </div>
          <div>
          {grandTotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <label htmlFor="expected_delivery_date" className="block md:text-xs text-[.5rem] font-medium text-gray-700">Expected Delivery Date:</label>
      <div className="">
        {formik.values.expected_delivery_date}
      </div>
        </div>
        <div className='flex justify-between items-center gap-10 mx-2'>
          
          <label htmlFor="payment_terms" className="block md:text-xs text-[.5rem] font-medium text-gray-700">Payment Terms:</label>
       <div className="">
        {formik.values.payment_terms}
       </div>
        </div>
      </div>
      {formik.values?.notes && 
      
      <div className="my-6">
        <label htmlFor="notes" className="block md:text-xs text-[.5rem] font-medium text-gray-700 underline">Notes:</label>
        {formik?.values?.notes}
      </div>
      }

      {showPrint && (

<div className="flex justify-center my-4 pb-10">   <button onClick={handlePrintfun} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium leading-none py-2 px-4 rounded">
  Print Invoice Order
</button>

</div>
)}
    </form>

    {/* Modal for adding items */}
    <Modal
      visible={showModal}
      onClose={() => setShowModal(false)}
      title="Products Form"
      content={<AddInvoiceOrderItemsForm items={items} products={filteredProducts} setItems={setItems} onClose={() => setShowModal(false)} />}
    />
    <Modal
      visible={showEditModal}
      onClose={() => setShowEditModal(false)}
      title="Edit Items to Purchase"
      id="Add-Purchase-column"
      content={<EditItemInvoiceOrderForm items={items} products={filteredProducts} setItems={setItems} onClose={() => setShowEditModal(false)} />}
    />
  </div>
  );
};

export default ViewSalesQuotation;

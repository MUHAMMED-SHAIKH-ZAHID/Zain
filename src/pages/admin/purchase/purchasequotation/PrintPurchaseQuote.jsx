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
import logo from '../../../../../public/images/logo.png'

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
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState(viewpurchase?.purchase_order_items || []);
    const [total, setTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [taxAmount,setTaxAmount] = useState(0)
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
     
            dispatch(convertPurchase(values))
            // navigate('/purchase/order/convert')
            // dispatch(updatePurchasequotation({ id: viewpurchase.id, purchaseData: values }))

        },
        enableReinitialize: true,  // This is crucial for reinitializing the form when viewpurchase changes

    });

    const calculateGrandTotal = () => {
      const total = items.reduce((acc, item) => acc + parseFloat(item.total_inc_tax || 0), 0);
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
      <div className="grid grid-cols-3 items-end">
        <div className="">
      <img src={logo} alt="" className='h-16 leading-none' />

        </div>
        <div className="grid justify-items-center">
                      <div className="text-xl font-medium justify-center flex items-end leading-none pb-3"> Purchase Order</div>
          <div className="">{viewpurchase?.purchase_order_number}</div>
        </div>
      </div>
                      <div className="grid grid-cols-[2fr,2fr,1fr] border text-[.9rem] border-b-0">
      <div className="">
        <div className="grid gap-1 p-2">
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize"> Name</div>
          <div className="capitalize justify-start">Gnidertron Private </div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Address</div>
          <div className="justify-start flex">No. 57/1003-C ,Near Abu Haji Hall</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Pin</div>
          <div className="justify-start flex">673003</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">GST No:</div>
          <div className="justify-start flex">32aalcg2360h1zt</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Phone Number</div>
          <div className="justify-start flex">916238492518</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">email :</div>
          <div className="justify-start flex">office@gnidetron.com</div>
          </div>
        </div>
    

      
      </div>
      <div className="">
      <div className="grid gap-1 p-1 border-l">
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Vendor </div>
          <div className="capitalize justify-start">{viewpurchase?.company_name} </div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Address</div>
          <div className="justify-start flex">{viewpurchase?.supplier_address}</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Pin code</div>
          <div className="justify-start flex">{viewpurchase?.pin}</div>
          </div>
         
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">GST</div>
          <div className="justify-start flex">{viewpurchase?.gst_number}</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Contact Person</div>
          <div className="justify-start flex">{viewpurchase?.supplier_name}</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Contact No.</div>
          <div className="justify-start flex">{viewpurchase?.suppier_name}</div>
          </div>
        </div>
   
    
      </div>
      {/* <div className="grid gap-1 p-1 border-l">
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Buyer </div>
          <div className="capitalize justify-start">{viewpurchase?.company_name} </div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Phone No</div>
          <div className="justify-start flex">{viewpurchase?.supplier_address}</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">email</div>
          <div className="justify-start flex">{viewpurchase?.pin}</div>
          </div>
         
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">PO Data</div>
          <div className="justify-start flex">{viewpurchase?.gst_number}</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Contact Person</div>
          <div className="justify-start flex">{viewpurchase?.supplier_name}</div>
          </div>
          <div className="grid grid-cols-2 justify-between">
          <div className="capitalize">Contact No.</div>
          <div className="justify-start flex">{viewpurchase?.suppier_name}</div>
          </div>
        </div> */}
    </div>
    <div className="border w-full p-1">
        <div className="grid grid-cols-[2fr,3fr] justify-between">
          <div className="flex">
          <div className="capitalize">Discount Allowed :</div>
          <div className="justify-start flex">{viewpurchase?.discount}</div>
          </div>
          <div className="flex">
          <div className="capitalize">Notes :</div>
          <div className="justify-start flex">{viewpurchase?.discount}</div>
          </div>
          
          </div>
        </div>
    <div className="border w-full p-1">
        <div className="grid grid-cols-[2fr,2fr,3fr,1fr,1fr] font-semibold text-sm py-1 justify-between">
          <div className=""></div>
          <div className="flex">
          <div className="capitalize">Count :</div>
          <div className="justify-start flex">&nbsp; {items?.length}</div>
          </div>
          <div className="flex">
          <div className="capitalize">Total :</div>
          <div className="justify-start flex">&nbsp; {viewpurchase?.grand_total}</div>
          </div>
          <div className="">{items.reduce((acc, item) => parseInt(acc) + parseInt(item.tax_amount), 0)}</div>
          <div className="justify-end flex">&nbsp; {viewpurchase?.grand_total}</div>
          </div>
        </div>
        
      <form onSubmit={formik.handleSubmit} className=" ">
      <div className="flex justify-between">
      

    </div>
          <div className="">
          <div className="">

            <table className="min-w-full divide-y divide-gray-200 border mt-5">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Brand </th>
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Mrp</th>
                  {/* <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">HSN</th> */}
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Taxable AMT</th>
                  {/* <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Discount</th> */}
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Gst (%)</th>
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">GST AMT</th>
                  <th scope="col" className="px-6 py-2 text-left text-[.7em] font-medium text-gray-500 uppercase tracking-wider">Total </th>
                </tr>
              </thead>
              {items?.length > 0 && (

              <tbody className="bg-white divide-y divide-gray-200">
                {items?.map((item, index) => (

                  <tr key={index}>
<td className="px-6 py-3  whitespace-nowrap text-xs text-gray-500">{products.find(i=>i.id == item.id)?.brand_name}</td>
<td className="px-6 py-3  whitespace-nowrap text-xs text-gray-500">{products.find(i=>i.id == item.id)?.category_name}</td>
<td className="px-6  whitespace-nowrap text-xs text-gray-500">
  {
    products?.find(pro => pro.id == item?.product_id)?.product_name || item?.product_id
  }
</td>

                    <td className="px-6 py-3  whitespace-nowrap text-xs text-gray-500">{products.find(i=>i.id == item.id)?.mrp}</td>
                    {/* <td className="px-6 py-3  whitespace-nowrap text-xs text-gray-500">{item?.hsn}</td> */}
                    <td className="px-6  whitespace-nowrap text-xs text-gray-500">{item?.price}</td>
                    <td className="px-6  whitespace-nowrap text-xs text-gray-500">{item?.quantity}</td>
                    <td className="px-6  whitespace-nowrap text-xs text-gray-500">{item?.total}</td>
                    {/* <td className="px-6  whitespace-nowrap text-xs text-gray-500">{item?.discount  || 0}</td> */}
                    <td className="px-6  whitespace-nowrap text-xs text-gray-500">{item?.tax || 0}</td>
                    <td className="px-6  whitespace-nowrap text-xs text-gray-500">{item?.tax_amount || 0}</td>
                    <td className="px-6  whitespace-nowrap text-xs text-gray-500">{item?.total_inc_tax ||0}</td>
                
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
 
      </div>
      
      <div className='flex justify-between'>
        <div className='flex justify-between gap-2'>
          <label htmlFor="expected_delivery_date" className="block text-sm font-medium text-gray-700">Expected Delivery Date:</label>
          <div className="">
          </div>
         {formik.values.expected_delivery_date}
        </div>
        <div className='flex justify-between items-center gap-10 '>
          <div className="">

          <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700">Payment Terms:</label>
          </div>
          <div className="">{formik.values.payment_terms}</div>
        </div>
      </div>
      {formik.values.notes &&
      
      <div className='my-6'>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 underline">Notes</label>
      <div className="">{formik?.values?.notes}</div>
      </div>
      }
      
        </form>
         {/* Modal for adding items */}
   
    </div>
  );
};

export default PrintPurchaseQuote;

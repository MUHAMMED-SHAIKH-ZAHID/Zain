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
import { createDebitNote } from '../../../../redux/features/DebitNoteSlice';
import { editPurchaseColumn } from '../../../../redux/features/PurchaseSlice';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';
import Modal from '../../../../components/commoncomponents/Modal';
import AddCreditForm from './AddCreditForm';
import { createCreditNote } from '../../../../redux/features/CreditNoteSlice';






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
  

  const purchaseValidationSchema = Yup.object({
    credit_note_date: Yup.date().required('Purchase date is required'),
    credit_note_number: Yup.number(),
    customer_id: Yup.string().required('Vendor is required'),
    notes: Yup.string(),
    credit_items: Yup.array()
      .of(itemSchema) // Ensure itemSchema is defined
      .min(1, 'At least one item is required'),
    total_excl_tax: Yup.number(),
    grand_total: Yup.number(),
    tax_amount: Yup.number(),
  });
  
 

const ViewCreditNotes = () => {
    const { viewpurchasedata,purchaseOrders,products,paymentModes, loading, error } = useSelector((state) => state?.purchases);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
 const [items, setItems] = useState(viewpurchasedata?.credit_note_items);
 const [total, setTotal] = useState(0);
 const [grandTotal, setGrandTotal] = useState(0);
 const [taxAmount,setTaxAmount] = useState(0)
 const [customErrMsg,setCustomErrMsg] = useState('')
 const [selectedSuplier,setSelectedSuplier] = useState()
 const [loadingMessage,setLoadingMessage] = useState(false)

  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      credit_note_date: viewpurchasedata?.credit_note_date || '',
      credit_note_number: viewpurchasedata?.credit_note_number || '',
      customer_id: viewpurchasedata?.customer_id ||'',
      credit_items: viewpurchasedata?.credit_note_items|| '',
      notes: viewpurchasedata?.notes || '',
    },
    validationSchema: purchaseValidationSchema,
    onSubmit: (values) => {
      values.credit_items = items;
  
      let errors = {};
      if (!values?.credit_items?.length) {
        errors.credit_items = 'At least one item is required';
      }
      if (Object.keys(errors).length > 0) {
        formik.setErrors(errors);
        return;
      }
  
      // Format dates before submission
      const formattedValues = {
        ...values,
        credit_note_date: format(values.credit_note_date, 'yyyy-MM-dd'),
      };
  
      setLoadingMessage(true)
      const promise = dispatch(createCreditNote(formattedValues));
      promise.then((res) => {
        if(res.payload.success){
          toast.success(res.payload.success);
           navigate('/creditnote/');
        }
        if (res.payload.error){
          toast.error(res.payload.error)
        }
      });
    },
    // enableReinitialize:true
  });
  
useEffect
  const dispatch = useDispatch()
    const { customers } = useSelector((state) => state?.creditNotes);
    const matchingPurchaseOrder = purchaseOrders?.find((po) => formik.values.purchase_order_id == po.id);

    useEffect(() => {
      const newTotal = items?.reduce((acc, item) => {
        const itemTotal = (parseFloat(item?.quantity) * parseFloat(item?.price)) || 0;
        return acc + itemTotal;
      }, 0);
      
      const totalTax = items?.reduce((acc, item) => {
        const itemTaxAmount = parseFloat(item?.tax_amount) || 0;
        return acc + itemTaxAmount;
      }, 0);
       const updatedTotal = newTotal+totalTax
      const newGrandTotal = (updatedTotal - (updatedTotal * (parseFloat(formik.values.discount)  || 0) / 100) ) || 0;
    //   const newPaymentBalance = newGrandTotal - (parseFloat(formik.values.paid_amount) || 0);
      
      setTaxAmount(totalTax);
      setTotal(newTotal);
      setGrandTotal(newGrandTotal);
      
      // Update Formik's field values
      formik.setFieldValue('total_excl_tax', newTotal?.toFixed(2));
      formik.setFieldValue('grand_total', newGrandTotal?.toFixed(2));
    //   formik.setFieldValue('payment_balance', newPaymentBalance.toFixed(2));
      formik.setFieldValue('tax_amount', totalTax?.toFixed(2));
      formik.setFieldValue('credit_items', items);
    }, [items, formik.values.discount, formik.values.paid_amount]);
    
    


   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items?.filter((_, i) => i !== index);
    setItems(newItems);
  };



  useEffect(() => {
    const filter = matchingPurchaseOrder?.purchase_order_items.map((item)=>{
      const selectedProduct = products.find(product => product.id == item?.product_id); 
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
    formik.setFieldTouched('credit_items', items);

  }, [formik.values.purchase_order_id, purchaseOrders]);


useEffect(() => {
  dispatch(setHeading("Credit Note "));
  return () => {
    dispatch(clearHeading());
  };
}, [dispatch]);

const handleEditItem = (index,itemsId) => {
  const item = items?.find(data => data.purchase_id == itemsId)
  dispatch(editPurchaseColumn({data:item,index:index}))
  setShowEditModal(true)
 }

 useEffect(() => {
  if(formik.values.customer_id){
    const vendorproducts = customers.find((item)=>{
     return item.id == formik.values.customer_id
    })
    setSelectedSuplier(vendorproducts)
  }
 }, [formik.values.customer_id])

  return (
    <div className="bg-white  p-5">
      <h2 className="text-xl font-medium mb-5 text-center">Add Credit Note </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2">
        <div className="grid grid-cols-2 w-full gap-4">
        <div className='w-full'>
        <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Customer :</label>
        <select
        disabled
            id="customer_id"
            {...formik.getFieldProps('customer_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">Select Customer</option>
            {customers?.map(item => (
                <option key={item.id} value={item.id}>{item.company_name}</option>
            ))}
        </select>
        {formik.touched.customer_id && formik.errors.customer_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.customer_id}</p>
        )}
    </div>

        </div>
        <div className="flex justify-end">

        <div>
            <label htmlFor="credit_note_date" className="block text-sm font-medium text-gray-700">Date:</label>
            <DatePicker
            disabled
                selected={formik.values.credit_note_date}
                onChange={(date) => formik.setFieldValue('credit_note_date', date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.credit_note_date && formik.errors.credit_note_date && (
                <p className="text-red-500 text-xs italic">{formik.errors.credit_note_date}</p>
            )}
        </div>

      
        </div>
    </div>


      {/* Items Table */}
        <div className="mt-10">
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">physical</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exbound</th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Incl Tax</th>
                </tr>
              </thead>
              {items?.length > 0 && (

              <tbody className="bg-white divide-y divide-gray-200">
                {items?.map((item, index) => (
                  <tr key={index}>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.reason}</td>
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.sale?.invoice_number}</td>
<td className="px-6  whitespace-nowrap text-sm text-gray-500">
  {
    products?.find(pro => pro.id == item?.product_id)?.product_name || item?.product_id
  }
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.hsn}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.tax || 0}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.quantity}</td>
                    {/* <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.inbound || 0} </td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.outbound || 0}</td> */}
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.price}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.total_inc_tax ||0}</td>
                    <td className="px-6 py-4  whitespace-nowrap flex items-center gap-4 justify-center text-right text-sm font-medium">
                      {/* <div className="flex items-center ">
                      <button type='button' onClick={() => handleEditItem(index,item.purchase_id)} className="text-primary-600 hover:text-red-900">
                      <CiEdit className='mt-5 w-6 h-5' /> &nbsp; &nbsp;
                      </button></div> */}
                     
                    </td>
                  </tr>
                ))}
              </tbody>
          )}
            </table>
          <div className="flex justify-center items-center py-2">
{formik.touched.credit_items && formik.errors.credit_items && (
    <p className="text-red-500 text-sm ">{formik.errors.credit_items}</p>)}
            </div>  

          </div>
        </div>
            <div className=" gap-4 justify-end mt-5 hidden">
  {/* Total Display */}
   <div>
        <label htmlFor="total_excl_tax" className="block text-sm font-medium text-gray-700">Total Exclude Tax:</label>
        <input
          id="total_excl_tax"
          type="text"
          {...formik.getFieldProps('total_excl_tax')}
          disabled // This field is disabled and cannot be edited by the user
          className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>



</div>


          <div className='my-6'>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes:</label>
          <textarea
            id="notes"
            disabled
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
        title="Add Credit Note"
        id={"credit-note-add"}
        content={<AddCreditForm products={selectedSuplier} items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
        {/* <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Items to Purchase"  
        id={"Add-Purchase-column"}
        content={<EditDebitForm products={selectedSuplier} items={items} setItems={setItems} onClose={() => setShowEditModal(false)} />}
      /> */}
    </div>
  );
};

export default ViewCreditNotes;

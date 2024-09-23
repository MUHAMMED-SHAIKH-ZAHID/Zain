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
    debit_note_date: Yup.date().required('Purchase date is required'),
    debit_note_number: Yup.number(),
    supplier_id: Yup.string().required('Vendor is required'),
    notes: Yup.string(),
    debit_items: Yup.array()
      .of(itemSchema) // Ensure itemSchema is defined
      .min(1, 'At least one item is required'),
    total_excl_tax: Yup.number(),
    grand_total: Yup.number(),
    tax_amount: Yup.number(),
  });
  
 

const ViewDebitNote = () => {
    const { viewpurchasedata,purchaseOrders,products} = useSelector((state) => state?.purchases);
 const [items, setItems] = useState(viewpurchasedata?.debit_note_items);
 const [selectedSuplier,setSelectedSuplier] = useState()
 const [loadingMessage,setLoadingMessage] = useState(false)
 

  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      debit_note_date: new Date(),
      debit_note_number: '',
      supplier_id: viewpurchasedata?.supplier_id || '',
      debit_items: viewpurchasedata?.debit_note_items || '',
      notes: viewpurchasedata?.notes || '',
      grand_total : viewpurchasedata?.grand_total || ''
    },
    validationSchema: purchaseValidationSchema,
    onSubmit: (values) => {
      values.debit_items = items;
  
      let errors = {};
      if (!values?.debit_items?.length) {
        errors.debit_items = 'At least one item is required';
      }
      if (Object.keys(errors).length > 0) {
        formik.setErrors(errors);
        return;
      }
  
      const formattedValues = {
        ...values,
        debit_note_date: format(values.debit_note_date, 'yyyy-MM-dd'),
      };
  
      const promise = dispatch(createDebitNote(formattedValues));
      setLoadingMessage(true)
      promise.then((res) => {
        if(res.payload.success){
          toast.success(res.payload.success);
            navigate('/debitnote/');
        }
        if (res.payload.error){
          toast.error(res.payload.error)
        }
      });
    },
    // enableReinitialize : true,
  });
  
useEffect
  const dispatch = useDispatch()
    const { suppliers } = useSelector((state) => state?.debitNotes);


    const matchingPurchaseOrder = purchaseOrders?.find((po) => formik.values.purchase_order_id == po.id);


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
    formik.setFieldTouched('debit_items', items);

  }, [formik.values.purchase_order_id, purchaseOrders]);


useEffect(() => {
  dispatch(setHeading("Debit Note "));
  return () => {
    dispatch(clearHeading());
  };
}, [dispatch]);


 useEffect(() => {
  if(formik.values.supplier_id){
    const vendorproducts = suppliers.find((item)=>{
     return item.id == formik.values.supplier_id
    })
    setSelectedSuplier(vendorproducts)
  }
 }, [formik.values.supplier_id])
 

  return (
    <div className="bg-white  p-5">
      <h2 className="text-xl font-medium mb-5 text-center">View Debit Note </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
        <div className='w-full'>
        <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">Venodr :</label>
        <select
        disabled
            id="supplier_id"
            {...formik.getFieldProps('supplier_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">Select Vendor</option>
            {suppliers?.map(item => (
                <option key={item.id} value={item.id}>{item.first_name}</option>
            ))}
        </select>
        {formik.touched.supplier_id && formik.errors.supplier_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.supplier_id}</p>
        )}
    </div>

        </div>
        <div className="flex justify-end">

        <div>
            <label htmlFor="debit_note_date" className="block text-sm font-medium text-gray-700">Date:</label>
            <DatePicker
            disabled
                selected={formik.values.debit_note_date}
                onChange={(date) => formik.setFieldValue('debit_note_date', date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.debit_note_date && formik.errors.debit_note_date && (
                <p className="text-red-500 text-xs italic">{formik.errors.debit_note_date}</p>
            )}
        </div>

      
        </div>
    </div>


      {/* Items Table */}
        <div className="mt-10">
          <div className="mt-4">
<div className="mb-2 flex justify-end">

  
</div>
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill No</th>
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
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.purchase?.bill_number }</td>
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
                  </tr>
                ))}
              </tbody>
          )}
            </table>
          <div className="flex justify-center items-center py-2">
{formik.touched.debit_items && formik.errors.debit_items && (
    <p className="text-red-500 text-sm ">{formik.errors.debit_items}</p>)}
            </div>  

          </div>
        </div>
        <div className="flex justify-end mr-5">

<div className="">Total Amount:</div>
<div className=""> &nbsp; ₹ {formik?.values?.grand_total}</div>
</div>


          <div className='my-6'>
          <label htmlFor="notes" className="block text-sm font-medium underline text-gray-700">Notes:</label>
        {formik?.values?.notes}
        </div>
        </form>
         {/* Modal for adding items */}
      {/* <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Products to Debit Note"
        content={<AddDebitForm products={selectedSuplier} items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
        <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Items to Debit Note"  
        id={"Add-Purchase-column"}
        content={<EditDebitForm products={selectedSuplier} items={items} setItems={setItems} onClose={() => setShowEditModal(false)} />}
      /> */}
    </div>
  );
};

export default ViewDebitNote;

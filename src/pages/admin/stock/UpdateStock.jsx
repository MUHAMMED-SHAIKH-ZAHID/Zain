import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { createStock, editStockColumn, fetchStocks } from '../../../redux/features/StockSlice';
import { clearHeading, setHeading } from '../../../redux/features/HeadingSlice';
import { editPurchaseColumn } from '../../../redux/features/PurchaseSlice';
import Modal from '../../../components/commoncomponents/Modal';
import EditDebitForm from '../purchase/debitnotes/EditDebitForm';
import { CiEdit } from 'react-icons/ci';
import UpdateStockForm from './UpdateStockForm';







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
  hsn:Yup.number(),
  new_inbound : Yup.number().min(0,"new stcok should be atleast one"),
  });
  

  const purchaseValidationSchema = Yup.object({
    stock_date: Yup.string().required('Purchase date is required'),
    credit_note_number: Yup.number(),
    bill_id: Yup.string().required('Bill is required'),
    notes: Yup.string(),
    purchase_items: Yup.array()
      .of(itemSchema) // Ensure itemSchema is defined
      .min(1, 'At least one item is required'),
  });
  
 

const UpdateStock = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
 const [items, setItems] = useState([]);
 const [total, setTotal] = useState(0);
 const [grandTotal, setGrandTotal] = useState(0);
 const [taxAmount,setTaxAmount] = useState(0)
 const [customErrMsg,setCustomErrMsg] = useState('')
 const [selectedBills,setSelectedBills] = useState()
  const [loadingMessage,setLoadingMessage] = useState(false)
  const navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      stock_date: Date.now(),
      bill_id:'',
      purchase_items: [],
    },
    validationSchema: purchaseValidationSchema,
    onSubmit: (values) => {
      values.purchase_items = items;
  
      let errors = {};
      if (!values?.purchase_items?.length) {
        errors.purchase_items = 'At least one item is required';
      }
      if (Object.keys(errors).length > 0) {
        formik.setErrors(errors);
        return;
      }

  
      // Format dates before submission
  
      let modifiedItems = values.purchase_items.map((item) => {
   
        let { stock,return: returnField,damage, ...rest } = item;
              return {
            ...rest,
            new_inbound : item?.new_inbound ? item.new_inbound: 0
        };
    });
    values.purchase_items = modifiedItems
    const formattedValues = {
      ...values,
      stock_date: format(values.stock_date, 'yyyy-MM-dd'),
    };
      
      const promise = dispatch(createStock(formattedValues));
      setLoadingMessage(true)
      promise.then((res) => {
        if(res.payload.success){
          toast.success(res.payload.success);
            navigate('/stock/');
        }
        if (res.payload.error){
          toast.error(res.payload.error)
        }
      });
    },
  });
  
useEffect
  const dispatch = useDispatch()
    const { products,paymentModes, loading, error } = useSelector((state) => state?.stock);
    const { bills } = useSelector((state) => state?.stock);

    useEffect(() => {
      formik.setFieldValue('purchase_items', items);
    }, [items, formik.values.discount, formik.values.paid_amount]);
    
         
    useEffect(() => {
      dispatch(fetchStocks())
    }, [])

   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items?.filter((_, i) => i !== index);
    setItems(newItems);
  };



useEffect(() => {
  dispatch(setHeading("Update Stock "));
  return () => {
    dispatch(clearHeading());
  };
}, [dispatch]);

const handleEditItem = (index,itemsId) => {
  const item = items?.find(data => data.product_id == itemsId)
  dispatch(editStockColumn({data:item,index:index}))
  setShowEditModal(true)
 }

 useEffect(() => {
  if(formik.values.bill_id){
    const BillProducts = bills.find((item)=>{
     return item.id == formik.values.bill_id
    })
    let modifiedItems = BillProducts.purchase_items.map((item) => {
      let { stock,return: returnField,damage,quantity, ...rest } = item;
            return {
          ...rest,
          quantity:parseInt(quantity)
          // physical_stock: stock?.physical_stock,
          // transit_stock: stock?.transit_stock
      };
  });
  
    setSelectedBills(BillProducts)
    setItems(modifiedItems)
  }
 }, [formik.values.bill_id])
 


  return (
    <div className="bg-white   p-5">
      <h2 className="text-xl font-medium mb-5 text-center">Stock Update </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
        <div className='w-full'>
        <label htmlFor="bill_id" className="block text-sm font-medium text-gray-700">Bill :</label>
        <select
            id="bill_id"
            {...formik.getFieldProps('bill_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">Select Bill</option>
            {bills?.map(item => (
                <option key={item.id} value={item.id}>{item.bill_number}</option>
            ))}
        </select>
        {formik.touched.bill_id && formik.errors.bill_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.bill_id}</p>
        )}
    </div>

        </div>
        <div className="flex justify-end">

        <div>
            <label htmlFor="stock_date" className="block text-sm font-medium text-gray-700">Date:</label>
            <DatePicker
                selected={formik.values.stock_date}
                onChange={(date) => formik.setFieldValue('stock_date', date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.stock_date && formik.errors.stock_date && (
                <p className="text-red-500 text-xs italic">{formik.errors.stock_date}</p>
            )}
        </div>

      
        </div>
    </div>


      {/* Items Table */}
        <div className="mt-10">
          <div className="mt-4">
{/* <div className="mb-2 flex justify-end">
  {formik.values.bill_id ?  <button type="button" onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-medium leading-none py-2 px-4 rounded">
          Add Products
        </button>  : <> <button type="button" onClick={() => toast.error("please Select Customer")} className="bg-blue-500 hover:bg-blue-700 text-white font-medium leading-none py-2 px-4 rounded">
          Add Products
        </button> </>}
  
</div> */}
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">physical</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
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

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.hsn}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.tax || 0}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.quantity}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.inbound }</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.outbound } </td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.price}</td>
                    <td className="px-6  whitespace-nowrap text-sm text-gray-500">{item?.total_inc_tax ||0}</td>
                    <td className="px-6 py-4  whitespace-nowrap flex items-center gap-4 justify-center text-right text-sm font-medium">
                      <div className="flex items-center ">
                      <button type='button' onClick={() => handleEditItem(index,item?.product_id)} className="text-primary-600 hover:text-red-900">
                      <CiEdit className='mt-5 w-6 h-5' /> &nbsp; &nbsp;
                      </button></div>
                      {/* <button type='button' onClick={() => handleDeleteItem(index)} className="text-red-600 hover:text-red-900">
                      <AiOutlineDelete className='w-5 h-5' />
                      </button> */}
                    </td>
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



        
        <div className="flex justify-center my-4" >
                  <button
        disabled={loadingMessage}
          type="submit"
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loadingMessage ? "animate-pulse" : ''}`}
        >
         {loadingMessage ? 'Updating Stock...': 'Update Stock' }
        </button>
        </div>
        </form>
         {/* Modal for adding items */}
      {/* <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Products to Purchase"
        content={<AddCreditForm products={selectedBills} items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      /> */}
        <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Items in Stock"  
        id={"Update-Edit-column"}
        content={<UpdateStockForm  items={items} selectedBills={selectedBills} setItems={setItems} onClose={() => setShowEditModal(false)} />}
      />
    </div>
  );
};

export default UpdateStock;

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import AddItemsQuoteForm from './AddItemsQuoteForm';
import Modal from '../../../../components/commoncomponents/Modal';
import { createPurchasequotation } from '../../../../redux/features/PurchaseQuotationSlice';
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import EditItemsQuoteForm from './EditItemsQuoteForm';
import { CiEdit } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { editPurchaseColumn } from '../../../../redux/features/PurchaseSlice';
import { format } from 'date-fns'; // make sure to import the date-fns library
import { Select } from 'antd';

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
  purchase_order_date: Yup.date().required('Purchase date is required'),
  purchase_order_number: Yup.string(),
  supplier_id: Yup.string().required('Vendor is required'),
  notes: Yup.string(),
  purchase_order_items: Yup.array().of(itemSchema).min(1, 'Please add at least 1 item to create the order'),
  grand_total: Yup.number().required('Grand total is required'),
  expected_delivery_date: Yup.date().required('Expected delivery date is required'),
  payment_terms: Yup.string().required('Payment terms are required'),
});

const AddPurchaseQuotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suppliers, products } = useSelector((state) => state?.purchases);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [items, setItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loadingMessage,setLoadingMessage] = useState(false)
 

  const calculateGrandTotal = () => {
    const total = items.reduce((acc, item) => acc + parseFloat(item.total_inc_tax || 0), 0);
    setGrandTotal(total);
    formik.setFieldValue('grand_total', total);
    formik.setFieldValue('purchase_order_items', items);
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

  const handleEditItem = (index, itemId) => {
    const item = items.find((data) => data.product_id === itemId);
    dispatch(editPurchaseColumn({ data: item, index: index }));
    setShowEditModal(true);
  };

  const formik = useFormik({
    initialValues: {
      purchase_order_date: new Date(),
      purchase_order_number: '',
      supplier_id: '',
      purchase_order_items: [],
      notes: '',
      grand_total: '',
      expected_delivery_date: '',
      payment_terms: '',
    },
    validationSchema: purchaseValidationSchema,
    onSubmit: (values) => {
      values.purchase_order_items = items;
      values.grand_total = grandTotal;
   

      // Format dates before submission
      values.purchase_order_date = format(values.purchase_order_date, 'yyyy-MM-dd');
      values.expected_delivery_date = format(values.expected_delivery_date, 'yyyy-MM-dd');

      const promise = dispatch(createPurchasequotation(values));
      setLoadingMessage(true)
      promise
        .then((res) => {
          if (res.payload.success) {
            toast.success(res.payload.success);
            navigate('/purchase/order');
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
console.log(suppliers,"hello")
  return (
    <div className="px-6 p-4 bg-white">
      <h2 className="text-xl font-medium mb-5 text-center">Create P O</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex justify-between">
          <div>
            <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">Company :</label>
            <Select
									showSearch
									style={{ width: '100%' }}
									onChange={e => {
                    formik.setFieldValue('supplier_id',e)
									}}
									placeholder='Select Company Name'
									optionFilterProp='children'
									filterOption={(input, option) =>
										option.props.children
											.toLowerCase()
											.indexOf(input?.toLowerCase()) >= 0
									}
								>
									{suppliers?.map(store => (
										<Select.Option key={store.id} value={store.id}>
											{store.company_name}
										</Select.Option>
									))}
								</Select>
            {formik.touched.supplier_id && formik.errors.supplier_id && (
              <p className="text-red-500 text-xs italic">{formik.errors.supplier_id}</p>
            )}
          </div>
          <div>
            <label htmlFor="purchase_order_date" className="block text-sm font-medium text-gray-700">Date:</label>
            <DatePicker
              selected={formik.values.purchase_order_date}
              onChange={(date) => formik.setFieldValue('purchase_order_date', date)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.purchase_order_date && formik.errors.purchase_order_date && (
              <p className="text-red-500 text-xs italic">{formik.errors.purchase_order_date}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-10">
          <div className="mt-4">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium leading-none py-2 px-4 rounded"
              >
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Incl Tax</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              {items?.length > 0 && (
                <tbody className="bg-white divide-y divide-gray-200">
                  {items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">
                        {products?.find((pro) => pro.id == item?.product_id)?.product_name || item?.product_id}
                      </td>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">{item?.hsn}</td>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">{item?.tax || 0}</td>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">{item?.quantity}</td>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">{item?.price}</td>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">{item?.total}</td>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">{item?.discount || 0}</td>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">{item?.tax_amount || 0}</td>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">{item?.total_inc_tax || 0}</td>
                      <td className="px-6 whitespace-nowrap text-sm text-gray-500">
                      {item?.comment?.length > 25 ? item?.comment?.slice(0, 25) + '...' : item?.comment }
                      </td>
                      <td className="px-6 whitespace-nowrap flex items-center gap-4 justify-center text-right text-sm font-medium">
                        <div className="flex items-center">
                          <button    type="button" onClick={() => handleEditItem(index, item.product_id)} className="text-primary-600 hover:text-red-900">
                            <CiEdit className="mt-5 w-6 h-5" /> &nbsp; &nbsp;
                          </button>
                        </div>
                        <button    type="button" onClick={() => handleDeleteItem(index)} className="text-red-600 hover:text-red-900">
                          <AiOutlineDelete className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            <div className="flex justify-center items-center py-2">
              {formik.touched.purchase_order_items && formik.errors.purchase_order_items && (
                <p className="text-red-500 text-sm">{formik.errors.purchase_order_items}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 justify-end mt-5">
          {/* Grand Total Display */}
          <div className="flex justify-between items-center gap-10 mx-2">
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

        <div className="flex justify-between">
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

        <div className="my-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes:</label>
          <textarea
            id="notes"
            {...formik.getFieldProps('notes')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add any relevant notes here..."
          />
        </div>
        <div className="flex justify-center my-4" >
                  <button
        disabled={loadingMessage}
          type="submit"
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loadingMessage ? "animate-pulse" : ''}`}
        >
         {loadingMessage ? 'Creating Order..': 'Create Purchase Order' }
        </button>
        </div>
      </form>

      {/* Modal for adding items */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Products Form"
        id="add-products-bill"
        content={<AddItemsQuoteForm items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
      <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Items to Purchase"
        id="Add-Purchase-column"
        content={<EditItemsQuoteForm items={items} setItems={setItems} onClose={() => setShowEditModal(false)} />}
      />
    </div>
  );
};

export default AddPurchaseQuotation;

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Select } from 'antd';

const itemSchema = (availableQuantity) => Yup.object().shape({
  product_id: Yup.number().required('Product is required'),
  sale_id: Yup.number(),
  quantity: Yup.number()
    .min(1, 'Quantity must be at least 1')
    .max(availableQuantity, `Quantity must not exceed available quantity of ${availableQuantity}`)
    .required('Quantity is required'),
  price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
  mrp: Yup.number()
    .min(1, 'MRP must be at least 1')
    .required('MRP is required')
    .when('price', (price, schema) => {
      return schema.min(price, 'MRP must be equal to or greater than the purchase price');
    }),
  discount: Yup.number().min(0, 'Discount must be at least 0').max(100, 'Discount must not exceed 100'),
  tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
  total: Yup.number(),
  tax_amount: Yup.number(),
  total_inc_tax: Yup.number(),
  hsn: Yup.number(),
  comment: Yup.string(),
  sale_item_id: Yup.string(),
  sales_invoice_no: Yup.string(),
  reason: Yup.string().required("Reason Is Required"),
});

const AddCreditForm = ({ products, items, setItems, onClose }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState('');
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [newProductId,setNewProductId] = useState('')


  useEffect(() => {
    if (!products || products?.length === 0) {
      setErrorMessage('Please select customer first.');
    } else {
      setErrorMessage('');
    }
  }, [products]);
 
  const formik = useFormik({
    initialValues: {
      sale_id: '',
      product_id: '',
      quantity: 0,
      price: 0,
      mrp: 0,
      discount: 0,
      tax: 0,
      total: 0,
      tax_amount: 0,
      total_inc_tax: 0,
      hsn: 0,
      comment: '',
      sale_item_id: '',
      sales_invoice_no:'',
      reason:'',
    },
    validationSchema: itemSchema(availableQuantity),
    onSubmit: (values, { resetForm }) => {
      values.product_id = newProductId
      console.log(values,"final value")

      values.sale_id = selectedPurchaseId;

      if (items) {
        setItems([...items, values]);
      } else {
        setItems([values]);
      }
      resetForm();
      onClose();
    },
  });

  useEffect(() => {
    const { quantity, price, discount, tax } = formik.values;
    const total = quantity * price * (1 - discount / 100);
    const taxAmount = (total * tax) / 100;
    const totalInclTax = total + taxAmount;

    formik.setFieldValue('total', total.toFixed(2));
    formik.setFieldValue('tax_amount', taxAmount.toFixed(2));
    formik.setFieldValue('total_inc_tax', totalInclTax.toFixed(2));
  }, [formik.values.quantity, formik.values.price, formik.values.discount,formik.values.tax]);

  useEffect(() => {
    const selectedPurchase = products?.sales?.find(purchase =>
      purchase.sales_items?.some(item => item?.id == formik.values?.product_id)
    );
    const isDuplicate = items?.some(
      item => item.sales_invoice_no === formik.values.sales_invoice_no && item.product_id === formik.values.product_id
    );
    if (isDuplicate) {
      // Show an error message or handle the duplicate case as needed
      toast.warn('An item with the same Purchase Bill Number and Product ID already exists.');
      formik.setFieldValue('product_id','')
      return;
    }
    console.log(selectedPurchase,"hgdfkjslakfhjgkls;kfhjgklsaf")
    if (selectedPurchase) {
      const productDetails = selectedPurchase.sales_items.find(item => item.id == formik.values.product_id);
      console.log(productDetails,"diya diya")
      formik.setFieldValue('ean_code', productDetails?.ean_code);
      formik.setFieldValue('tax', productDetails?.tax);
      formik.setFieldValue('hsn', productDetails?.hsn);
      formik.setFieldValue('price', productDetails?.price);
      formik.setFieldValue('mrp', productDetails?.mrp);
      formik.setFieldValue('sale_item_id', productDetails?.id);
      formik.setFieldValue('quantity', productDetails?.quantity);
      setNewProductId(productDetails?.product_id)
      // formik.setFieldValue('sales_invoice_no',selectedPurchase?.invoice_number);
      // setSelectedPrice([productDetails?.price]);
      // setSelectedMRP([productDetails?.mrp]);
      setAvailableQuantity(productDetails?.quantity); // Update available quantity
      // setDisableEan(true);
    } else {
      // setDisableEan(false);
    }
  }, [formik.values.product_id, products]);
  const handleInvoiceChange = (e) => {
      const selectedPurchase = products?.sales?.find(purchase => purchase.id == parseInt(e.target.value));
      formik.setFieldValue('sales_invoice_no',selectedPurchase?.invoice_number)
    setSelectedPurchaseId(e.target.value);
    setPurchaseItems(selectedPurchase ? selectedPurchase.sales_items : []);
  };
  const reasons = [
    {name:"Return",value:"return"},
    {name:"Damage",value:"damage"}
  ]
  return (
    <form onSubmit={formik.handleSubmit} className="">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div>
          <label htmlFor="sale_id" className="block text-sm font-medium text-gray-700">Invoice Number:</label>
          <select
            id="sale_id"
            value={selectedPurchaseId}
            onChange={handleInvoiceChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a Invoice</option>
            {products?.sales?.map(purchase => (
              <option key={purchase.id} value={purchase.id}>
                {purchase.invoice_number}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product_id" className="block text-sm pb-1 font-medium text-gray-700">Product:</label>
          <Select
									showSearch
                  size='middle'
									style={{ width: '100%' , outline:"none"}}
									onChange={e => {
                    formik.setFieldValue('product_id',e)
									}}
									placeholder='Select a Product'
									optionFilterProp='children'
                  defaultValue={formik.values?.product_id}
									filterOption={(input, option) =>
										option.props.children
											.toLowerCase()
											.indexOf(input?.toLowerCase()) >= 0
									}
								>
									{purchaseItems?.map(product => (
										<Select.Option key={product.id} value={product.id}>
											{product.product_name}
										</Select.Option>
									))}
								</Select>
          {formik.touched.product_id && formik.errors.product_id && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.product_id}</p>
          )}
        </div>

        <div>
          <label htmlFor="hsn" className="block text-sm font-medium text-gray-700">HSN:</label>
          <input
            id="hsn"
            disabled
            type="number"
            {...formik.getFieldProps('hsn')}
            placeholder="HSN"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.hsn && formik.errors.hsn && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.hsn}</p>
          )}
        </div>

        <div>
          <label htmlFor="tax" className="block text-sm font-medium text-gray-700">Tax:</label>
          <input
            id="tax"
            disabled
            type="number"
            {...formik.getFieldProps('tax')}
            placeholder="Tax"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.tax && formik.errors.tax && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.tax}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
          <input
            id="quantity"
            type="number"
            {...formik.getFieldProps('quantity')}
            placeholder="Quantity"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.quantity && formik.errors.quantity && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.quantity}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
          <input
            id="price"
            type="number"
            {...formik.getFieldProps('price')}
            placeholder="Price"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.price && formik.errors.price && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="mrp" className="block text-sm font-medium text-gray-700">MRP:</label>
          <input
            id="mrp"
            type="number"
            {...formik.getFieldProps('mrp')}
            placeholder="MRP"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.mrp && formik.errors.mrp && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.mrp}</p>
          )}
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%):</label>
          <input
            id="discount"
            type="number"
            {...formik.getFieldProps('discount')}
            placeholder="Discount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.discount && formik.errors.discount && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.discount}</p>
          )}
        </div>

        <div>
          <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total:</label>
          <input
            id="total"
            disabled
            type="number"
            {...formik.getFieldProps('total')}
            placeholder="Total"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.total && formik.errors.total && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.total}</p>
          )}
        </div>

        <div>
          <label htmlFor="tax_amount" className="block text-sm font-medium text-gray-700">Tax Amount:</label>
          <input
            id="tax_amount"
            disabled
            type="number"
            {...formik.getFieldProps('tax_amount')}
            placeholder="Tax Amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.tax_amount && formik.errors.tax_amount && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.tax_amount}</p>
          )}
        </div>

        <div>
          <label htmlFor="total_inc_tax" className="block text-sm font-medium text-gray-700">Total Inc. Tax:</label>
          <input
            id="total_inc_tax"
            disabled
            type="number"
            {...formik.getFieldProps('total_inc_tax')}
            placeholder="Total Inc. Tax"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.total_inc_tax && formik.errors.total_inc_tax && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.total_inc_tax}</p>
          )}
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason:</label>
          <select
          
            id="reason"
            {...formik.getFieldProps('reason')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select the Reason</option>
            {reasons.map(item => (
              <option key={item.value} value={item.value} className='capitalize'>{item?.name}</option>
            ))}
          </select>
          {formik.touched.reason && formik.errors.reason && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.reason}</p>
          )}
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment:</label>
          <textarea
            id="comment"
            {...formik.getFieldProps('comment')}
            placeholder="Comment"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.comment && formik.errors.comment && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.comment}</p>
          )}
        </div>
      </div>
        <div className="flex justify-end space-x-2 mt-5">
          <button type="button" onClick={onClose} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 ">
            Close
          </button>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 ">
            Add Credit Note
          </button>
        </div>
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  );
};

export default AddCreditForm;

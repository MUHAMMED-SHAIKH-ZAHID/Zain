import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const itemSchema = (availableQuantity) => Yup.object().shape({
  product_id: Yup.number(),
  purchase_id: Yup.number(),
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
  purchase_item_id: Yup.string(),
  reason: Yup.string().required("Reason Is Required"),
});

const EditDebitForm = ({ products, items, setItems, onClose }) => {
    const {editpurchasecolumn} = useSelector((state) => state?.purchases);
  const [errorMessage, setErrorMessage] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const { editpurchaseindex, loading, error } = useSelector((state) => state?.purchases);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(editpurchasecolumn?.purchase_id);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [disableProduct, setDisableProduct] = useState(false);
  const [disableEan, setDisableEan] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedMRP, setSelectedMRP] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0) {
      setErrorMessage('Please select customer first.');
    } else {
      setErrorMessage('');
    }
  }, [products]);

  const formik = useFormik({
    initialValues : {
        purchase_id: editpurchasecolumn?.purchase_id || '',
        product_id: editpurchasecolumn?.product_id || '',
        quantity: editpurchasecolumn?.quantity || 0,
        price: editpurchasecolumn?.price || 0,
        mrp: editpurchasecolumn?.mrp || 0,
        discount: editpurchasecolumn?.discount || 0,
        tax: editpurchasecolumn?.tax || 0,
        total: editpurchasecolumn?.total || 0,
        tax_amount: editpurchasecolumn?.tax_amount || 0,
        total_inc_tax: editpurchasecolumn?.total_inc_tax || 0,
        hsn: editpurchasecolumn?.hsn || 0,
        comment: editpurchasecolumn?.comment || '',
        purchase_item_id: editpurchasecolumn?.purchase_item_id || '',
        reason:editpurchasecolumn?.reason || '',
      },
    validationSchema: itemSchema(availableQuantity),
    onSubmit: (values, { resetForm }) => {
        values.purchase_id = selectedPurchaseId;

      const updatedItems = items ? items.map((item, index) => {
        if (index === editpurchaseindex) {
          return values;
        }
        return item;
      }) : [];
      if (items?.length == 0 || editpurchaseindex == 0 || editpurchaseindex == null) {
        updatedItems.push(values);
      }

      setItems(updatedItems);
      resetForm();
      onClose();
    },
    enableReinitialize: true,
  });
  useEffect(() => {
    formik.setFieldValue('product_id', editpurchasecolumn?.product_id);
    formik.setFieldValue('purchase_id', editpurchasecolumn?.purchase_id);
  }, [editpurchasecolumn]);
  useEffect(() => {
    const { quantity, price, discount, tax } = formik.values;
    const total = quantity * price * (1 - discount / 100);
    const taxAmount = (total * tax) / 100;
    const totalInclTax = total + taxAmount;

    formik.setFieldValue('total', total.toFixed(2));
    formik.setFieldValue('tax_amount', taxAmount.toFixed(2));
    formik.setFieldValue('total_inc_tax', totalInclTax.toFixed(2));
  }, [formik.values.quantity, formik.values.price, formik.values.discount, formik.values.tax]);

  useEffect(() => {
    const selectedPurchase = products?.purchases?.find(purchase =>
      purchase.purchase_items.some(item => item.product_id === formik.values.product_id)
    );
    if (selectedPurchase) {
      const productDetails = selectedPurchase.purchase_items.find(item => item.product_id == formik.values.product_id);
      formik.setFieldValue('ean_code', productDetails.ean_code);
      formik.setFieldValue('tax', productDetails.tax);
      formik.setFieldValue('hsn', productDetails.hsn);
      formik.setFieldValue('price', productDetails.price);
      formik.setFieldValue('mrp', productDetails.mrp);
      formik.setFieldValue('purchase_item_id', productDetails.id);
      formik.setFieldValue('quantity', productDetails.quantity);
      setSelectedPrice([productDetails.price]);
      setSelectedMRP([productDetails.mrp]);
      setAvailableQuantity(productDetails.quantity); // Update available quantity
      setDisableEan(true);
    } else {
      setDisableEan(false);
    }
  }, [formik.values.product_id, products]);

  const handlePurchaseChange = (e) => {
    const selectedPurchase = products?.purchases?.find(purchase => purchase.id === parseInt(e.target.value));
    setSelectedPurchaseId(e.target.value);
    setPurchaseItems(selectedPurchase ? selectedPurchase.purchase_items : []);
  };
  const reasons = [
    {name:"Return",value:"return"},
    {name:"Damage",value:"damage"}
  ]

  return (
    <form onSubmit={formik.handleSubmit} className="">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div>
          <label htmlFor="purchase_id" className="block text-sm font-medium text-gray-700">Purchase ID:</label>
          <select
            id="purchase_id"
            value={selectedPurchaseId}
            onChange={handlePurchaseChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a purchase</option>
            {products?.purchases?.map(purchase => (
              <option key={purchase.id} value={purchase.id}>
                {purchase.bill_number}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product:</label>
          <select
            id="product_id"
            disabled={disableProduct}
            {...formik.getFieldProps('product_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a product</option>
            {purchaseItems.map(item => (
              <option key={item.product_id} value={item.product_id}>{item.product.product_name}</option>
            ))}
          </select>
          {formik.touched.product_id && formik.errors.product_id && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.product_id}</p>
          )}
        </div>

        <div>
          <label htmlFor="hsn" className="block text-sm font-medium text-gray-700">Hsn :</label>
          <input
            id="hsn"
            disabled
            type="number"
            {...formik.getFieldProps('hsn')}
            placeholder="hsn"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.hsn && formik.errors.hsn && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.hsn}</p>
          )}
        </div>

        <div>
          <label htmlFor="tax" className="block text-sm font-medium text-gray-700">Tax :</label>
          <input
            id="tax"
            disabled
            type="number"
            {...formik.getFieldProps('tax')}
            placeholder="tax"
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
          <select
            id="price"
            {...formik.getFieldProps('price')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Price</option>
            {selectedPrice.map((price, index) => (
              <option key={index} value={price}>{price}</option>
            ))}
          </select>
          {formik.touched.price && formik.errors.price && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="mrp" className="block text-sm font-medium text-gray-700">MRP:</label>
          <select
            id="mrp"
            {...formik.getFieldProps('mrp')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select MRP</option>
            {selectedMRP.map((mrp, index) => (
              <option key={index} value={mrp}>{mrp}</option>
            ))}
          </select>
          {formik.touched.mrp && formik.errors.mrp && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.mrp}</p>
          )}
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount:</label>
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
          <label htmlFor="total_inc_tax" className="block text-sm font-medium text-gray-700">Total Including Tax:</label>
          <input
            id="total_inc_tax"
            disabled
            type="number"
            {...formik.getFieldProps('total_inc_tax')}
            placeholder="Total Including Tax"
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
          <input
            id="comment"
            type="text"
            {...formik.getFieldProps('comment')}
            placeholder="Comment"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.comment && formik.errors.comment && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.comment}</p>
          )}
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditDebitForm;

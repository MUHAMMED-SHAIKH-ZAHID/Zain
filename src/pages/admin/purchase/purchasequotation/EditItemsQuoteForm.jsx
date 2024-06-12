import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const itemSchema = Yup.object().shape({
  product_id: Yup.string().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  price: Yup.number().min(1, 'Price must be at least 1').required('Price is required'),
  mrp: Yup.number()
  .min(1, 'MRP must be at least 1')
  .required('MRP is required')
  .when('price', (price, schema) => {
    return schema.min(price, 'MRP must be equal to or greater than the purchase price');
  }),  discount: Yup.number().min(0, 'Discount must be at least 0').max(100, 'Discount must not exceed 100'),
  tax: Yup.number().min(0, 'Tax must be at least 0').max(100, 'Tax must not exceed 100'),
  total: Yup.number(),
  tax_amount: Yup.number(),
  total_inc_tax: Yup.number(),
  hsn: Yup.number(),
  comment: Yup.string(),
});

const EditItemsQuoteForm = ({ items, setItems, onClose }) => {
  const { products, editpurchasecolumn, editpurchaseindex, loading, error } = useSelector((state) => state?.purchases);
  console.log(products, "Consoling products in the form");
  const [disableProduct, setDisableProduct] = useState(false);
  const [disableEan, setDisableEan] = useState(false);
  const [selectedPrice,setSeletedPrice] = useState([])
  const [selectedMRP,setSeletedMRP] = useState([])
  const formik = useFormik({
    initialValues: {
      product_id: editpurchasecolumn?.product_id || '',
      quantity: editpurchasecolumn?.quantity || 1,
      price: editpurchasecolumn?.price || 0,
      mrp: editpurchasecolumn?.mrp || 0,
      discount: editpurchasecolumn?.discount || 0,
      tax: editpurchasecolumn?.tax || 0,
      total: editpurchasecolumn?.total || 0,
      tax_amount: editpurchasecolumn?.tax_amount || 0,
      total_inc_tax: editpurchasecolumn?.total_inc_tax || 0,
      hsn: editpurchasecolumn?.hsn || 0,
      ean_code: editpurchasecolumn?.ean_code || 0,
      comment: editpurchasecolumn?.comment || '',
    },
    validationSchema: itemSchema,
    onSubmit: (values, { resetForm }) => {
      console.log(values, "checking the items to update value", editpurchasecolumn.id, items[0].id);

      const updatedItems = items?.map((item, index) => {
        console.log(item, "checking in map");
        if (index === editpurchaseindex) {
          return values;
        }
        return item;
      });
      console.log(updatedItems, "checking the items to update", editpurchaseindex);
      setItems(updatedItems);
      resetForm();
      onClose();
    },
  });
  useEffect(() => {
    const { quantity, price, discount, tax } = formik.values;
    const total = quantity * price * (1 - discount / 100);
    const taxAmount = total * tax / 100;
    const totalInclTax = total + taxAmount;

    formik.setFieldValue('total', total.toFixed(2));
    formik.setFieldValue('tax_amount', taxAmount.toFixed(2));
    formik.setFieldValue('total_inc_tax', totalInclTax.toFixed(2));
  }, [formik.values.quantity, formik.values.price, formik.values.discount, formik.values.tax]);

  useEffect(() => {
    const selectedProduct = products.find(product => product.id == formik.values.product_id);
    if (selectedProduct) {
      formik.setFieldValue('ean_code', selectedProduct.ean_code);
      formik.setFieldValue('tax', selectedProduct.tax_rate);
      formik.setFieldValue('hsn', selectedProduct.hsn_code);
      setSeletedPrice(selectedProduct.p_rate)
      setSeletedMRP(selectedProduct.mrps)
      setDisableEan(true);
    } else {
      setDisableEan(false);
    }
  }, [formik.values.product_id, products]);
    console.log(formik.values,"before issue bi bib bib bi bi ")
  useEffect(() => {
    if (formik.values?.ean_code?.toString()?.length === 6) {
      const selectedProduct = products.find(product => product.ean_code == formik.values.ean_code);
      if (selectedProduct) {
        formik.setFieldValue('product_id', selectedProduct.id);
        setDisableProduct(true);
      } else {
        formik.setFieldValue('product_id', '');
        setDisableProduct(false);
      }
    } else {
      formik.setFieldValue('product_id', '');
      setDisableProduct(false);
    }
  }, [formik.values.ean_code, products]);

  return (
    <form onSubmit={formik.handleSubmit} className="">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div>
          <label htmlFor="ean_code" className="block text-sm font-medium text-gray-700">Ean Code:</label>
          <input
            id="ean_code"
            type="number"
            disabled={disableEan}
            {...formik.getFieldProps('ean_code')}
            placeholder="ean_code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.ean_code && formik.errors.ean_code && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.ean_code}</p>
          )}
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
            {products?.map(product => (
              <option key={product.id} value={product.id}>{product.product_name}</option>
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
          {formik.touched.tax && formik.errors.tax && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.tax}</p>
          )}
        </div>
        <div>
          <label htmlFor="tax" className="block text-sm font-medium text-gray-700">Tax :</label>
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
          <select
            id="price"
            {...formik.getFieldProps('price')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a Price</option>
            {selectedPrice?.map(product => (
              <option key={product} value={product}>{product}</option>
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
            <option value="">Select a MRP</option>
            {selectedMRP?.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
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
            placeholder="Discount Percentage"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.discount && formik.errors.discount && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.discount}</p>
          )}
        </div>

        <div>
          <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total (Excl. Tax):</label>
          <input
            id="total"
            type="text"
            value={formik.values.total}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="tax_amount" className="block text-sm font-medium text-gray-700">Tax Amount:</label>
          <input
            id="tax_amount"
            type="text"
            value={formik.values.tax_amount}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="total_inc_tax" className="block text-sm font-medium text-gray-700">Total (Incl. Tax):</label>
          <input
            id="total_inc_tax"
            type="text"
            value={formik.values.total_inc_tax}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
          />
        </div>
        <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment:</label>
            <textarea
              id="comment"
              {...formik.getFieldProps('comment')}
              placeholder="Add a comment"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.comment && formik.errors.comment && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.comment}</p>
            )}
          </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update Product
        </button>
      </div>
    </form>
  );
};

export default EditItemsQuoteForm;

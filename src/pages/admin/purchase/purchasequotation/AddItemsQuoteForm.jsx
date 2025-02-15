import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Select } from 'antd';

const itemSchema = Yup.object().shape({
  product_id: Yup.string().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  price: Yup.number().required('Price is required'),
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
  ean_code: Yup.string(),
  comment: Yup.string(),
});

const AddItemsQuoteForm = ({ items, setItems, onClose }) => {
  const { products, loading, error } = useSelector((state) => state?.purchases);
  const [disableProduct, setDisableProduct] = useState(false);
  const [disableEan, setDisableEan] = useState(false);
  const formik = useFormik({
    initialValues: {
      product_id: '',
      quantity: 1,
      price: 0,
      mrp: 0,
      discount: 0,
      tax: 0,
      total: 0,
      tax_amount: 0,
      total_inc_tax: 0,
      hsn: 0,
      ean_code: 0,
      comment: ''
    },
    validationSchema: itemSchema,
    onSubmit: (values, { resetForm }) => {
      if (items) {
        setItems([...items, values]);
      } else {
        setItems([values]);
      }
      resetForm();
      onClose();
    },
  });
  const [selectedPrice,setSeletedPrice] = useState([])
  const [selectedMRP,setSeletedMRP] = useState([])
  
  useEffect(() => {
    const { quantity, price, discount, tax } = formik.values;
    const total = quantity * price * (1 - discount / 100);
    const taxAmount = total * tax / 100;
    const totalInclTax = total + taxAmount;

    formik.setFieldValue('total', total.toFixed(2));
    formik.setFieldValue('tax_amount', taxAmount.toFixed(2));
    formik.setFieldValue('total_inc_tax', totalInclTax.toFixed(2));
  }, [formik.values.quantity, formik.values.price, formik.values.discount, formik.values.tax,formik.values.product_id, products]);

  useEffect(() => {
    if (items?.some(item => item.product_id == formik.values.product_id)) {
      toast.warn("This item has already been selected.")
      formik.setFieldValue('product_id','')
    }else{
    const selectedProduct = products?.find(product => product.id == formik.values.product_id);
    if (selectedProduct) {
      if(selectedProduct?.ean_code){
        formik.setFieldValue('ean_code', selectedProduct.ean_code);
      }else{
        formik.setFieldValue('ean_code', 0);
      }
      formik.setFieldValue('tax', selectedProduct.tax_rate);
      formik.setFieldValue('hsn', selectedProduct.hsn_code);
      formik.setFieldValue('mrp',selectedProduct?.mrp)
      formik.setFieldValue('price',selectedProduct.p_rate)
      setSeletedPrice(selectedProduct.p_rate)
      setSeletedMRP(selectedProduct.mrps)
      setDisableEan(true);
    } else {
      setDisableEan(false);
    }}
  }, [formik.values.product_id, products]);


  useEffect(() => {
    if (formik.values.ean_code?.toString().length >= 4 && formik.values.ean_code?.toString().length <= 12) {
      const selectedProduct = products.find(product => product.ean_code == formik.values.ean_code);
      if (selectedProduct) {
        // formik.setFieldValue('product_id', selectedProduct.id);
        setDisableProduct(true);
      } else {
        // formik.setFieldValue('product_id', '');
        setDisableProduct(false);
      }
    } else {
    //   formik.setFieldValue('product_id', '');
      setDisableProduct(false);
    }
  }, [formik.values.ean_code, products,formik.values.product_id]);

  
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
									filterOption={(input, option) =>
										option.props.children
											.toLowerCase()
											.indexOf(input?.toLowerCase()) >= 0
									}
								>
									{products?.map(product => (
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
          <input
          disabled
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
          disabled
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
          Add Item
        </button>
      </div>
    </form>
  );
};

export default AddItemsQuoteForm;

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const itemSchema = Yup.object().shape({
  product_id: Yup.number().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
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
  ean_code: Yup.string()
,  outbound: Yup.number(),
  inbound: Yup.number(),
  new_inbound:Yup.number().required("please update stock"),
});

const UpdateStockForm = ({ items, selectedBills, setItems, onClose }) => {
    const { products, editstockcolumn,editstockindex,loading, error } = useSelector((state) => state?.stock);
   console.log(editstockcolumn,"Dyeah zzz",selectedBills)

  const formik = useFormik({
    initialValues: {
      product_id: editstockcolumn?.product_id || items[editstockindex]?.product_id || '',
      quantity: editstockcolumn?.quantity ||items[editstockindex]?.quantity ||  0,
      price:editstockcolumn?.price || editstockcolumn?.stock?.product?.p_rate ||items[editstockindex]?.price ||  0,
      mrp: editstockcolumn?.stock?.product?.mrp ||items[editstockindex]?.mrp ||  0,
      discount: editstockcolumn?.discount ||items[editstockindex]?.discount ||  0,
      tax: editstockcolumn?.stock?.product?.tax_rate ||items[editstockindex]?.tax ||  0,
      total: editstockcolumn?.total ||items?.total ||items[editstockindex]?.total ||  0,
      tax_amount: editstockcolumn?.tax_amount ||items[editstockindex]?.tax_amount ||  0,
      total_inc_tax: editstockcolumn?.total_inc_tax || items[editstockindex]?.total_inc_tax || 0,
      hsn: editstockcolumn?.stock?.product?.hsn_code || items[editstockindex]?.hsn ||  0,
      ean_code: editstockcolumn?.stock?.product?.ean_code ||items[editstockindex]?.ean_code ||  0,
      inbound :editstockcolumn.inbound || selectedBills?.purchase_items[editstockindex]?.stock?.inbound ||  0,
      outbound :editstockcolumn.outbound || selectedBills?.purchase_items[editstockindex]?.stock?.outbound||  0,
      product_name : editstockcolumn?.stock?.product?.product_name ||items[editstockindex]?.product_name ||  0,
      new_inbound:editstockcolumn?.stock?.new_inbound || 0,
      purchase_id:editstockcolumn?.purchase_id || ''
    },
    validationSchema: itemSchema,
    onSubmit: (values, { resetForm }) => {
      
      let errors = {};
      if(parseInt(values.quantity) < (parseInt(values.inbound) +parseInt(values.new_inbound))){
        errors. new_inbound = 'physical + new stock must not exceed quantity';
      }
      if(parseInt(values.new_inbound) <= 0){
        errors. new_inbound = ' new stock must be minimum quantity';
      }
      if (Object.keys(errors).length > 0) {
        formik.setErrors(errors);
        return;
      }
      values.inbound = (parseInt(values.inbound)+parseInt(values.new_inbound))
      values.outbound = (parseInt(values.quantity) - parseInt(values.inbound))
      const updatedItems = items.map((item,index) => {
          if(index === editstockindex){
              return values
          }
          return item
      })
    setItems(updatedItems)
    resetForm();
    onClose();
  },
  enableReinitialize : true
  });
  useEffect(() => {
    const { quantity, price, discount, tax } = formik.values;
    const total = quantity * price * (1 - discount / 100);
    const taxAmount = (total * tax) / 100;
    const totalInclTax = total + taxAmount;

    formik.setFieldValue('total', total.toFixed(2));
    formik.setFieldValue('tax_amount', taxAmount.toFixed(2));
    formik.setFieldValue('total_inc_tax', totalInclTax.toFixed(2));
  }, [formik.values.quantity, formik.values.price, formik.values.discount, formik.values.tax]);

//   useEffect(() => {
//     const selectedProduct = products?.find(product => product?.id == formik.values?.product_id);
//     if (selectedProduct) {
//       formik.setFieldValue('ean_code', selectedProduct.ean_code);
//       formik.setFieldValue('tax', selectedProduct.tax_rate);
//       formik.setFieldValue('hsn', selectedProduct.hsn_code);
//       formik.setFieldValue('product_id', selectedProduct.product_id);
//       setSelectedPrice(selectedProduct.price);
//       setSelectedMRP(selectedProduct.mrps);
//       setDisableEan(true);
//     } else {
//       setDisableEan(false);
//     }
//   }, [formik.values.product_id, products]);

//   useEffect(() => {
//     if (formik.values.ean_code.toString().length >= 4 && formik.values.ean_code.toString().length <= 12) {
//       const selectedProduct = products?.find(product => product.ean_code == formik.values.ean_code);
//       if (selectedProduct) {
//         // formik.setFieldValue('product_id', selectedProduct.id);
//         setDisableProduct(true);
//       } else {
//         // formik.setFieldValue('product_id', '');
//         setDisableProduct(false);
//       }
//     } else {
//     //   formik.setFieldValue('product_id', '');
//       setDisableProduct(false);
//     }
//   }, [formik.values.ean_code, products,formik.values.product_id]);


  return (
    <form onSubmit={formik.handleSubmit} className="">
      <div className="grid grid-cols-2 gap-4 p-4">
   
        <div className=''>
          <label htmlFor="ean_codename" className="block text-sm font-medium text-gray-700">Ean Code:</label>
          <input
            id="ean_codename"
            type="number"
            disabled
           value=     {
            products?.find(pro => pro.id == editstockcolumn?.product_id)?.ean_code
          }
            placeholder="ean_code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
 
       
        </div>
        <div className='hidden'>
          <label htmlFor="ean_code" className="block text-sm font-medium text-gray-700">Ean Code:</label>
          <input
            id="ean_code"
            type="number"
            disabled
            {...formik.getFieldProps('ean_code')}
            placeholder="ean_code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.ean_code && formik.errors.ean_code && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.ean_code}</p>
          )}
        </div>
        <div className=''>
          <label htmlFor="productname" className="block text-sm font-medium text-gray-700">Product Name:</label>
          <input
            id="productname"
            type="text"
            disabled
           value=                 {
            products?.find(pro => pro.id == editstockcolumn?.product_id)?.product_name || editstockcolumn?.product_id
          }
            placeholder=""
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
       
        </div>

        <div className='hidden'>
          <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product:</label>
          <select
            id="product_id"
            disabled
            {...formik.getFieldProps('product_id')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
           
        
              <option key={editstockcolumn?.stock?.product?.id || items[editstockindex]?.product_id } value={editstockcolumn?.stock?.product?.id || items[editstockindex]?.product_id }>{editstockcolumn?.stock?.product?.product_name || items[editstockindex]?.product_name }</option>
        
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
          disabled
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
            disabled
            {...formik.getFieldProps('price')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
           
              <option key={editstockcolumn?.stock?.product?.p_rate || items[editstockindex]?.price } value={editstockcolumn?.stock?.product?.p_rate || items[editstockindex]?.price }>{editstockcolumn?.stock?.product?.p_rate || items[editstockindex]?.price }</option>
        
          </select>
          {formik.touched.price && formik.errors.price && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="mrp" className="block text-sm font-medium text-gray-700">MRP:</label>
          <select
            id="mrp"
            disabled
            {...formik.getFieldProps('mrp')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
       
              <option key={editstockcolumn?.stock?.product?.mrp || items[editstockindex]?.mrp } value={editstockcolumn?.stock?.product?.mrp || items[editstockindex]?.mrp }>{editstockcolumn?.stock?.product?.mrp || items[editstockindex]?.mrp }</option>
       
          </select>
          {formik.touched.mrp && formik.errors.mrp && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.mrp}</p>
          )}
        </div>

        <div className='hidden'>
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

        <div className='hidden'>
          <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total (Excl. Tax):</label>
          <input
            id="total"
            type="text"
            value={formik.values.total}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
          />
        </div>

        <div className='hidden'>
          <label htmlFor="tax_amount" className="block text-sm font-medium text-gray-700">Tax Amount:</label>
          <input
            id="tax_amount"
            type="text"
            value={formik.values.tax_amount}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
          />
        </div>

        <div className=''>
          <label htmlFor="total_inc_tax" className="block text-sm font-medium text-gray-700">Total (Incl. Tax):</label>
          <input
            id="total_inc_tax"
            type="text"
            value={formik.values.total_inc_tax}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
          />
        </div>
        
        <div className=''>
          <label htmlFor="inbound" className="block text-sm font-medium text-gray-700">Physical Stock:</label>
          <input
          disabled
            id="inbound"
            type="number"
            {...formik.getFieldProps('inbound')}
            placeholder="Transit Stock"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.inbound && formik.errors.inbound && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.inbound}</p>
          )}
        </div>
        <div className=''>
          <label htmlFor="outbound" className="block text-sm font-medium text-gray-700">Transit Stock:</label>
          <input
          disabled
            id="outbound"
            type="number"
            {...formik.getFieldProps('outbound')}
            placeholder="Transit Stock"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.outbound && formik.errors.outbound && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.outbound}</p>
          )}
        </div>
        <div className=''>
          <label htmlFor="new_inbound" className="block text-sm font-medium text-gray-700">New Physical Stock</label>
          <input
            id="new_inbound"
            type="number"
            {...formik.getFieldProps('new_inbound')}
            placeholder="Transit Stock"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.new_inbound && formik.errors.new_inbound && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.new_inbound}</p>
          )}
        </div>
   
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update Item
        </button>
      </div>
    </form>
  );
};

export default UpdateStockForm;

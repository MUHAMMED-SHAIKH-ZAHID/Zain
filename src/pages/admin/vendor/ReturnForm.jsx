import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../../../components/commoncomponents/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createSupplierReport } from '../../../redux/features/SupplierSlice';

const validationSchema = Yup.object().shape({
  product_id: Yup.number().required('Product is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  action_type: Yup.string().required('Action type is required'),
  notes: Yup.string()
  
});

const RetutnForm = ({ show, handleClose, data = {} }) => {
  const { products } = useSelector(state => state.supplier);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const dispatch = useDispatch()

  const selectedid = data?.id

  const formik = useFormik({
    initialValues: {
      reference_id: data.supplier_id || '',
      product_id: '',
      quantity: 0,
      action_type: '',
      notes: ''
    },
    validationSchema,
    onSubmit: values => {
      dispatch(createSupplierReport({supplierData:values,Id:selectedid}))
      // handleClose();
      // dispatch an action to store data
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const selectedProduct = data.purchase_items?.find(item => item.id === parseInt(formik.values.product_id));
    setMaxQuantity(selectedProduct ? selectedProduct.quantity : 0);
  }, [formik.values.product_id, data.purchase_items]);
  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Supplier (Reference ID):</label>
        <input
          type="text"
          className=" block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled
          hidden
          value={formik.values.reference_id}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Product:</label>
        <select
          className=" block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...formik.getFieldProps('product_id')}
        >
          <option value="">Select a product</option>
          {data.purchase_items?.map(product => (
            <option key={product.product_id} value={product.product_id}>{product.product_name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity:</label>
        <input
          type="number"
          className=" block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...formik.getFieldProps('quantity')}
          max={maxQuantity}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Action Type:</label>
        <select
          className=" block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...formik.getFieldProps('action_type')}
        >
          <option value="">Select action</option>
          <option value="return">Return</option>
          <option value="damage">Damage</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes:</label>
        <textarea
          className=" block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...formik.getFieldProps('notes')}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={handleClose} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Cancel
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Submit
        </button>
      </div>
    </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="supplier-action-form-modal" content={modalContent} title="Return Form" />
  );
};

export default RetutnForm;

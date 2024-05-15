import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../../../components/commoncomponents/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { updateSupplier } from '../../../redux/features/SupplierSlice';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('First name is required'),
  code: Yup.string(),
  email: Yup.string().email("Invalid email address").required('Email is required'),
  contact_one: Yup.string()
    .matches(/^\d{10}$/, 'Mobile must be exactly 10 digits')
    .required('Mobile number is required'),
  contact_two: Yup.string()
    .matches(/^\d{10}$/, 'Mobile must be exactly 10 digits')
    .nullable(true),
  address_one: Yup.string().required('Address is required'),
  address_two: Yup.string(),
  company_name: Yup.string().required('Company name is required'),
  gst_number: Yup.string().required('GST is mandatory'),
  pan_number: Yup.string(),
  location_id: Yup.string().required('Country is required'),
});

const EditSupplier = ({ show, handleClose, data = {} }) => {
  const { locations, loading, error } = useSelector((state) => state?.supplier);
  console.log(data,"from to edit")

  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      name: data.name || '',
      code: data.code || '',
      email: data.email || '',
      contact_one: data.contact_one || '',
      contact_two: data.contact_two || '',
      address_one: data.address_one || '',
      address_two: data.address_two || '',
      company_name: data.company_name || '',
      gst_number: data.gst_number || '',
      pan_number: data.pan_number || '',
      location_id: data.location_id || '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values,"Checking values");
      dispatch(updateSupplier({ id: data.id, supplierData: values }));

      handleClose();
    },
    enableReinitialize: true,
  });

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {['name', 'code', 'email', 'contact_one', 'contact_two', 'address_one', 'address_two', 'company_name', 'gst_number', 'pan_number'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</label>
            <input
              type={field.includes('email') ? 'email' : 'text'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...formik.getFieldProps(field)}
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="mt-2 text-sm text-red-600">{formik.errors[field]}</p>
            )}
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Location:</label>
        <select
            id="location_id"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...formik.getFieldProps('location_id')}
          >
            <option value="">Select a location</option>
            {locations.map(item => {

           return  <option key={item.id} value={item.id}>{item.location}</option>
            })}
          </select>
        {formik.touched.location_id && formik.errors.location_id && (
          <p className="mt-2 text-sm text-red-600">{formik.errors.location_id}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={handleClose} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Discard
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Update Supplier
        </button>
      </div>
    </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="edit-supplier-modal" content={modalContent} title="Edit Supplier" />
  );
};

export default EditSupplier;

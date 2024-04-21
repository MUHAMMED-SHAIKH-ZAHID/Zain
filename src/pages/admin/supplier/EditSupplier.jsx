import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../../../components/commoncomponents/Modal';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  code: Yup.string(),
  email: Yup.string().email("Invalid email address").required('Email is required'),
  mobile: Yup.string().matches(/^\d{10}$/, 'Mobile must be exactly 10 digits').required('Mobile number is required'),
  mobile2: Yup.string().matches(/^\d{10}$/, 'Mobile must be exactly 10 digits'),
  address: Yup.string().required('Address is required'),
  address2: Yup.string(),
  company: Yup.string().required('Company name is required'),
  gst: Yup.string().required('GST number is required'),
  pannumber: Yup.string(),
  location: Yup.string().required('Location is required'),
});

const EditSupplier = ({ show, handleClose, data = {} }) => {
  const formik = useFormik({
    initialValues: {
      name: data.name || '',
      code: data.code || '',
      email: data.email || '',
      mobile: data.mobile || '',
      mobile2: data.mobile2 || '',
      address: data.address || '',
      address2: data.address2 || '',
      company: data.company || '',
      gst: data.gst || '',
      pannumber: data.pannumber || '',
      location: data.location || '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleClose();
    },
    enableReinitialize: true,
  });

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {['name', 'code', 'email', 'mobile', 'mobile2', 'address', 'address2', 'company', 'gst', 'pannumber'].map(field => (
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...formik.getFieldProps('location')}
        >
          <option value=''>Select a location</option>
          <option value='kz'>Kozhikode</option>
          <option value='kc'>Kochi</option>
          <option value='tl'>Thalassery</option>
          <option value='vd'>Vadakara</option>
          <option value='ml'>Malappuram</option>
          <option value='kt'>Kottayam</option>
        </select>
        {formik.touched.location && formik.errors.location && (
          <p className="mt-2 text-sm text-red-600">{formik.errors.location}</p>
        )}
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={handleClose} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Discard
        </button>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save
        </button>
      </div>
    </form>
  );

  return (
    <Modal visible={show} onClose={handleClose} id="edit-supplier-modal" content={modalContent} title="Edit Supplier" />
  );
};

export default EditSupplier;

import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { createSupplier } from '../../../redux/features/SupplierSlice';

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
  location: Yup.string().required('Country is required'),
});

const AddSupplier = ({ handleClose }) => {
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      email: '',
      contact_one: '',
      contact_two: '',
      address_one: '',
      address_two: '',
      company_name: '',
      gst_number: '',
      pan_number: '',
      location: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(createSupplier(values));
      handleClose();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="First name"
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
          <input
            type="text"
            id="code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Code (Optional)"
            {...formik.getFieldProps('code')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Email"
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
          <input
            type="text"
            id="mobile"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Mobile"
            {...formik.getFieldProps('contact_one')}
          />
          {formik.touched.contact_one && formik.errors.contact_one && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.contact_one}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="mobile2" className="block text-sm font-medium text-gray-700">Mobile Second</label>
          <input
            type="text"
            id="mobile2"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Mobile 2 (Optional)"
            {...formik.getFieldProps('contact_two')}
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address_one"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Address"
            {...formik.getFieldProps('address_one')}
          />
          {formik.touched.address_one && formik.errors.address_one && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.address_one}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700">Address 2</label>
          <input
            type="text"
            id="address2"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Address 2 (Optional)"
            {...formik.getFieldProps('address_two')}
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
          <input
            type="text"
            id="company"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Company name"
            {...formik.getFieldProps('company_name')}
          />
          {formik.touched.company_name && formik.errors.company_name && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.company_name}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="gst" className="block text-sm font-medium text-gray-700">GST Number</label>
          <input
            type="text"
            id="gst"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="GST Number"
            {...formik.getFieldProps('gst_number')}
          />
          {formik.touched.gst_number && formik.errors.gst_number && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.gst_number}</p>
          )}
        </div>
        <div>
          <label htmlFor="pannumber" className="block text-sm font-medium text-gray-700">PAN Number</label>
          <input
            type="text"
            id="pannumber"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="PAN Number"
            {...formik.getFieldProps('pan_number')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <select
            id="location"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...formik.getFieldProps('location')}
          >
            <option value="">Select a location</option>
            <option value="kz">Kozhikode</option>
            <option value="kc">Kochi</option>
            <option value="tl">Thalassery</option>
            <option value="vd">Vadakara</option>
            <option value="ml">Malappuram</option>
            <option value="kt">Kottayam</option>
          </select>
          {formik.touched.location && formik.errors.location && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.location}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-5">
        <button type="button" onClick={handleClose} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded">
          Close
        </button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Add
        </button>
      </div>
    </form>
  );
};

export default AddSupplier;

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { createSupplier } from '../../../redux/features/SupplierSlice';
import { useState } from 'react';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  suffix: Yup.string().required('Suffix is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string(),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  contact_number: Yup.string()
    .matches(/^\d{10}$/, 'Mobile must be exactly 10 digits')
    .required('Mobile number is required'),
  address: Yup.string().required('Address is required'),
  company_name: Yup.string().required('Company name is required'),
  gst_number: Yup.string()
  .matches(/^[0-9a-zA-Z]{15}$/, 'GST number must be exactly 15 alphanumeric characters')
  .required('GST number is required'),
pan_number: Yup.string()
  .matches(/^[0-9a-zA-Z]{10}$/, 'PAN number must be exactly 10 alphanumeric characters')
  .required('PAN number is required'),
  bank_details: Yup.string(),
  payment_terms: Yup.string(),
  tds: Yup.string(),
});

const AddVendor = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.supplier);
  const [message, setMessage] = useState();

  const formik = useFormik({
    initialValues: {
      suffix: '',
      first_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      address: '',
      company_name: '',
      gst_number: '',
      pan_number: '',
      bank_details: '',
      payment_terms: '',
      tds: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
   const promise =   dispatch(createSupplier(values))
      promise.then((res) => {
        console.log(res, "checking the res");
        if (res.payload.errors){
          console.log("SSSSSSSSSSOOOOOOOONAA",res.payload.errors.email)
          if (res.payload.errors.email){
          toast.error(res.payload.errors.email[0])}
          else    if (res.payload.errors.gst_number){

            toast.error(res.payload.errors.gst_number[0])
          }else    if (res.payload.errors.pan_number){
          toast.error(res.payload.errors.pan_number[0])}
        }
        if(res.payload.success){
                 toast.success(res.payload.success);

          setTimeout(() => {
  handleClose()
          }, 1000);
        }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="suffix" className="block text-sm font-medium text-gray-700">Suffix</label>
          <select
            id="suffix"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            {...formik.getFieldProps('suffix')}
          >
            <option value="">Select a suffix</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
          </select>
          {formik.touched.suffix && formik.errors.suffix && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.suffix}</p>
          )}
        </div>
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="first_name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="First name"
            {...formik.getFieldProps('first_name')}
          />
          {formik.touched.first_name && formik.errors.first_name && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.first_name}</p>
          )}
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="last_name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Last name"
            {...formik.getFieldProps('last_name')}
          />
        </div>
    
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
          <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            id="contact_number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Contact number"
            {...formik.getFieldProps('contact_number')}
          />
          {formik.touched.contact_number && formik.errors.contact_number && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.contact_number}</p>
          )}
        </div>
      
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Address"
            {...formik.getFieldProps('address')}
          />
          {formik.touched.address && formik.errors.address && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.address}</p>
          )}
        </div>
        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            id="company_name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Company name"
            {...formik.getFieldProps('company_name')}
          />
          {formik.touched.company_name && formik.errors.company_name && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.company_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="gst_number" className="block text-sm font-medium text-gray-700">GST Number</label>
          <input
            type="text"
            id="gst_number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="GST number"
            {...formik.getFieldProps('gst_number')}
          />
          {formik.touched.gst_number && formik.errors.gst_number && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.gst_number}</p>
          )}
        </div>
        <div>
          <label htmlFor="pan_number" className="block text-sm font-medium text-gray-700">PAN Number</label>
          <input
            type="text"
            id="pan_number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="PAN number"
            {...formik.getFieldProps('pan_number')}
          />
        </div>
 
        <div>
          <label htmlFor="bank_details" className="block text-sm font-medium text-gray-700">Bank Details</label>
          <input
            type="text"
            id="bank_details"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Bank details"
            {...formik.getFieldProps('bank_details')}
          />
        </div>
        <div>
          <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700">Payment Terms</label>
          <input
            type="text"
            id="payment_terms"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Payment terms"
            {...formik.getFieldProps('payment_terms')}
          />
        </div>

        <div>
          <label htmlFor="tds" className="block text-sm font-medium text-gray-700">TDS</label>
          <input
            type="text"
            id="tds"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="TDS"
            {...formik.getFieldProps('tds')}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-5">
          <button type="button" onClick={handleClose} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 ">
            Close
          </button>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white space-x-2 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 ">
            Add Vendor
          </button>
        </div>
    </form>
  );
};

export default AddVendor;

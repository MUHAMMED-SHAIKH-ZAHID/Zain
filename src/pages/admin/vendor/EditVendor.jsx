import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../../../components/commoncomponents/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { updateSupplier } from '../../../redux/features/SupplierSlice';
import { toast } from 'react-toastify';
import Modal2 from '../../../components/commoncomponents/Modal2';
import { useState } from 'react';

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
  // .matches(/^[0-9a-zA-Z]{15}$/, 'GST number must be exactly 15 alphanumeric characters')
  .required('GST number is required'),
pan_number: Yup.string()
  .matches(/^[0-9a-zA-Z]{10}$/, 'PAN number must be exactly 10 alphanumeric characters'),
  bank_details: Yup.string().required('Bank Name is required'),
  payment_terms: Yup.string(),
  tds: Yup.string(),
  ifsc: Yup.string()
  // .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
  .required('IFSC code is required'),
pin: Yup.string()
  .matches(/^[1-9][0-9]{5}$/, 'Invalid PIN code')
  .required('PIN code is required'),
bank_branch: Yup.string()
  .min(3, 'Bank branch name must be at least 3 characters'),
  // .required('Bank branch name is required'),
account_number: Yup.string()
  .matches(/^[0-9]{9,18}$/, 'Invalid account number')
  .required('Account number is required')
});

const EditVendor = ({ show, handleClose, data = {} }) => {
  const dispatch = useDispatch();
  const [loadingMessage,setLoadingMessage] = useState(false)


  const formik = useFormik({
    initialValues: {
      suffix: data.suffix || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      contact_number: data.contact_number || '',
      address: data.address || '',
      company_name: data.company_name || '',
      gst_number: data.gst_number || '',
      pan_number: data.pan_number || '',
      bank_details: data.bank_details || '',
      payment_terms: data.payment_terms || '',
      tds: data.tds || '',
      ifsc:data.ifsc ||'',
      pin:data.pin ||'',
      bank_branch:data.bank_branch ||'',
      account_number:data.account_number ||'',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoadingMessage(true)
      dispatch(updateSupplier({ id: data.id, supplierData: values })).then((res) => {
        toast.success(res.payload.success);
        if (res.payload.error){
          toast.error(res.payload.error)
        }
      });

      handleClose();
    },
    enableReinitialize: true,
  });

  const modalContent = (
    <form onSubmit={formik.handleSubmit} className="l">
      <div className="grid grid-cols-3 gap-4">
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
          <label htmlFor="pin" className="block text-sm font-medium text-gray-700">Pin Code</label>
          <input
            type="number"
            id="pin"
            className="mt-1 block no-number-spin w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Pincode"
            {...formik.getFieldProps('pin')}
          />
          {formik.touched.pin && formik.errors.pin && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.pin}</p>
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
          {formik.touched.pan_number && formik.errors.pan_number && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.pan_number}</p>
          )}
        </div>
 
        <div>
          <label htmlFor="bank_details" className="block text-sm font-medium text-gray-700">Bank Name</label>
          <input
            type="text"
            id="bank_details"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Bank Name"
            {...formik.getFieldProps('bank_details')}
          />
        {formik.touched.bank_details && formik.errors.bank_details && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.bank_details}</p>
          )}
        </div>
        <div>
          <label htmlFor="bank_branch" className="block text-sm font-medium text-gray-700">Branch</label>
          <input
            type="text"
            id="bank_branch"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Branch Name"
            {...formik.getFieldProps('bank_branch')}
          />
            {formik.touched.bank_branch && formik.errors.bank_branch && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.bank_branch}</p>
          )}
        </div>
        <div>
          <label htmlFor="ifsc" className="block text-sm font-medium text-gray-700">Ifsc Code</label>
          <input
            type="text"
            id="ifsc"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder=" IFSC Code"
            {...formik.getFieldProps('ifsc')}
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
          />
            {formik.touched.ifsc && formik.errors.ifsc && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.ifsc}</p>
          )}
        </div>
        <div>
          <label htmlFor="account_number" className="block text-sm font-medium text-gray-700">Account Number</label>
          <input
            type="text"
            id="account_number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder=" Account Number"
            {...formik.getFieldProps('account_number')}
          />
            {formik.touched.account_number && formik.errors.account_number && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.account_number}</p>
          )}
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
          <button disabled={loadingMessage} type="submit"  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loadingMessage ? "animate-pulse" : ''}`} >
         {loadingMessage ? 'Updating Vendor...': 'Update Vendor' }
        </button>
        </div>
    </form>
  );

  return (
    <Modal2 visible={show} onClose={handleClose} id="edit-vendor-modal" content={modalContent} title="Edit Vendor" size = 'big' />
  );
};

export default EditVendor;

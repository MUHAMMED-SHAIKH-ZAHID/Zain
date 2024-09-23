import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { createCustomer } from '../../../redux/features/salesExecutive/CustomerExecutiveSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  company_name: Yup.string().required('Company name is required'),
  phone: Yup.string().required('Phone is required').matches(/^\d{10}$/, 'Must be exactly 10 digits'),
  address: Yup.string().required('Address is required'),
  map_link: Yup.string().url('Must be a valid URL'),
  gst: Yup.string(),
  // .matches(/^[a-zA-Z0-9]{15}$/, 'Must be exactly 15 characters').required("GST number is mandatory"),
  pan: Yup.string().matches(/^[a-zA-Z0-9]{10}$/, 'Must be exactly 10 characters'),
  channel_id: Yup.string().required('Channel is required'),
  route_id: Yup.string().required('Route is required'),
  credit_days: Yup.number().required('Credit days are required').min(0, 'Credit days must be at least 0'),
  shipping_addresses: Yup.array().of(
    Yup.object().shape({
      address: Yup.string().required('Shipping address is required')
    })
  ),
});

const AddEecutiveCustomer = ({ handleClose }) => {
  const { channels ,routes} = useSelector(state => state?.customerexecutive); // Assuming `channels` is the data you need
  const dispatch = useDispatch();
  const [shippingAddresses, setShippingAddresses] = useState([{ address: '' }]);
  const [loadingMessage,setLoadingMessage] = useState(false)


  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      company_name: '',
      phone: '',
      address: '',
      map_link: '',
      gst: '',
      pan: '',
      channel_id: '',
      credit_days: '',
      route_id:'',
      shipping_addresses: [{ address: '' }],
    },
    validationSchema,
    onSubmit: (values) => {
      const promise=  dispatch(createCustomer(values))
      setLoadingMessage(true)
      promise.then((res) => {
        if (res.payload.errors){
          setLoadingMessage(false)
          if (res.payload.errors.email){
          toast.error(res.payload.errors.email[0])}
          else    if (res.payload.errors.gst){

            toast.error(res.payload.errors.gst[0])
          }else    if (res.payload.errors.pan){
          toast.error(res.payload.errors.pan[0])}
        }
        if(res.payload.message){
          toast.success(res.payload.message);
          handleClose()
        }
      });
    },
  });

  useEffect(() => {
    formik.setFieldValue('shipping_addresses', shippingAddresses);
  }, [shippingAddresses]);

  const handleAddShippingAddress = () => {
    if(formik.errors.shipping_addresses){
      toast.warn("last  shipping address is Empty",)
      return
    }
    setShippingAddresses([...shippingAddresses, { address: '' }]);
  };

  const handleRemoveShippingAddress = (index) => {
    const newShippingAddresses = [...shippingAddresses];
    newShippingAddresses.splice(index, 1);
    setShippingAddresses(newShippingAddresses);
  };

  const handleShippingAddressChange = (index, value) => {
    const newShippingAddresses = [...shippingAddresses];
    newShippingAddresses[index].address = value;
    setShippingAddresses(newShippingAddresses);
  };
  return (
    <form onSubmit={formik.handleSubmit} className="">
      <div className="grid grid-cols-4 gap-4">
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.name && formik.errors.name ? 'border-red-500' : ''
            }`}
            placeholder="Name"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-xs italic">{formik.errors.name}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.email && formik.errors.email ? 'border-red-500' : ''
            }`}
            placeholder="Email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs italic">{formik.errors.email}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="company_name" className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.company_name}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.company_name && formik.errors.company_name ? 'border-red-500' : ''
            }`}
            placeholder="Company Name"
          />
          {formik.touched.company_name && formik.errors.company_name && (
            <p className="text-red-500 text-xs italic">{formik.errors.company_name}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
            }`}
            placeholder="Phone"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-xs italic">{formik.errors.phone}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.address && formik.errors.address ? 'border-red-500' : ''
            }`}
            placeholder="Address"
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-red-500 text-xs italic">{formik.errors.address}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="map_link" className="block text-gray-700 text-sm font-bold mb-2">Map Link</label>
          <input
            type="text"
            id="map_link"
            name="map_link"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.map_link}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.map_link && formik.errors.map_link ? 'border-red-500' : ''
            }`}
            placeholder="Map Link"
          />
          {formik.touched.map_link && formik.errors.map_link && (
            <p className="text-red-500 text-xs italic">{formik.errors.map_link}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="gst" className="block text-gray-700 text-sm font-bold mb-2">GST</label>
          <input
            type="text"
            id="gst"
            name="gst"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.gst.toUpperCase()}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.gst && formik.errors.gst ? 'border-red-500' : ''
            }`}
            placeholder="GST"
          />
          {formik.touched.gst && formik.errors.gst && (
            <p className="text-red-500 text-xs italic">{formik.errors.gst}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="pan" className="block text-gray-700 text-sm font-bold mb-2">PAN</label>
          <input
            type="text"
            id="pan"
            name="pan"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pan.toUpperCase()}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.pan && formik.errors.pan ? 'border-red-500' : ''
            }`}
            placeholder="PAN"
          />
          {formik.touched.pan && formik.errors.pan && (
            <p className="text-red-500 text-xs italic">{formik.errors.pan}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="route_id" className="block text-gray-700 text-sm font-bold mb-2">Routes</label>
          <select
            id="route_id"
            name="route_id"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.route_id}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.route_id && formik.errors.route_id ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select a Sales Routes</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>
                {route.route}
              </option>
            ))}
          </select>
          {formik.touched.route_id && formik.errors.route_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.route_id}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="channel_id" className="block text-gray-700 text-sm font-bold mb-2">Channel</label>
          <select
            id="channel_id"
            name="channel_id"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.channel_id}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.channel_id && formik.errors.channel_id ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select a channel</option>
            {channels.map(channel => (
              <option key={channel.id} value={channel.id}>
                {channel.channel}
              </option>
            ))}
          </select>
          {formik.touched.channel_id && formik.errors.channel_id && (
            <p className="text-red-500 text-xs italic">{formik.errors.channel_id}</p>
          )}
        </div>
        <div className="mb-4 col-span-2 sm:col-span-1">
          <label htmlFor="credit_days" className="block text-gray-700 text-sm font-bold mb-2">Credit Days</label>
          <input
            type="number"
            id="credit_days"
            name="credit_days"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.credit_days}
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              formik.touched.credit_days && formik.errors.credit_days ? 'border-red-500' : ''
            }`}
            placeholder="Credit Days"
          />
          {formik.touched.credit_days && formik.errors.credit_days && (
            <p className="text-red-500 text-xs italic">{formik.errors.credit_days}</p>
          )}
        </div>
        <div className="col-span-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">Shipping Addresses</label>
          <div className="h-24 overflow-y-auto no-scrollbar">
            {shippingAddresses.map((address, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea
                  value={address.address}
                  onChange={(e) => handleShippingAddressChange(index, e.target.value)}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={`Shipping Address ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveShippingAddress(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddShippingAddress}
            className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
          >
            <FaPlus className="mr-1" />
            Add Shipping Address
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-5">
          <button type="button" onClick={handleClose} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 ">
            Close
          </button>
          <button
        disabled={loadingMessage}
          type="submit" onClick={()=>formik.errors.shipping_addresses ? toast.warn("A shipping Address Is Empty") : ''}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loadingMessage ? "animate-pulse" : ''}`}
        >
         {loadingMessage ? 'Adding Customer...': 'Add Customer' }
        </button>
        </div>
    </form>
  );
};

export default AddEecutiveCustomer;

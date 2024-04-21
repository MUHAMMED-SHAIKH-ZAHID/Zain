import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 characters')
    .required('Password is required'),
});

const initialValues = {
  email: '',
  password: '',
};

const Data = [
  { email: 'admin@demo.com', password: 'demo', role: "admin" },
  { email: 'sales@demo.com', password: '1234', role: "sales" }
];

export function Login() {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const user = Data.find(u => u.email === values.email && u.password === values.password);
      if (user) {
        console.log('User logged in:', user);
        setLoading(false);
      } else {
        setStatus('Invalid login credentials');
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
      <div className="w-full max-w-md">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <h1 className="block text-gray-900 text-lg font-bold mb-2">Zain Sale Corp</h1>
          <h2 className="block text-primary-500 text-lg font-bold mb-4">Sign In</h2>

          {formik.status && (
            <div className='bg-red-500 text-white p-3 rounded mb-4'>
              {formik.status}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs italic">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoCapitalize='current-password'
              {...formik.getFieldProps('password')}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs italic">{formik.errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Link to="/auth/forgot-password" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {loading ? 'Loading…' : 'Sign In'}
            </button>
          </div>

          <div className="text-center mt-6">
            Not a Member yet?{' '}
            <Link to="/auth/registration" className="text-blue-500 hover:text-blue-800">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

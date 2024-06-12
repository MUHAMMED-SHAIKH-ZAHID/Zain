import { useState, useEffect } from 'react';
import * as Yup from 'yup';

export const AccountForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ account_name: '', opening_balance: '' });
  const [error, setError] = useState('');
  console.log(initialData,"tje data that is passed")
  useEffect(() => {
    if (initialData) {
      setFormData({ account_name: initialData?.account_name || '', opening_balance: initialData?.opening_balance || '' });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validation schema
    const accountSchema = Yup.object().shape({
      account_name: Yup.string().required('Account account_name is required'),
      opening_balance: Yup.number().required('Opening balance is required').positive('Opening Balance must be positive').integer('opening_balance must be an integer')
    });

    try {
      await accountSchema.validate(formData);
      onSubmit(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="mb-4">
        <label htmlFor="account_name" className="block text-gray-700 text-sm font-bold mb-2">Account Name:</label>
        <input type="text" name="account_name" value={formData?.account_name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="account_name" />
      </div>
      <div className="mb-6">
        <label htmlFor="opening_balance" className="block text-gray-700 text-sm font-bold mb-2">Opening Balance:</label>
        <input type="number" name="opening_balance" value={formData?.opening_balance} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="opening_balance" />
        {/* {error && <p className="text-red-500 text-xs italic">{error}</p>} */}
      </div>
      <div className="flex items-center justify-end gap-2">
          <button 
            type="button" 
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-black font-normal py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-normal py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1"
          >
            Submit
          </button>
        </div>
    </form>
  );
};

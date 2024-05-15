import { useState, useEffect } from 'react';
import * as Yup from 'yup';

export const TaxForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', tax_rate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name || '', tax_rate: initialData.tax_rate || '' });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validate tax rate not exceeding 100%
    const taxSchema = Yup.object().shape({
      tax_rate: Yup.number().required().max(100, 'Tax rate cannot exceed 100%'),
    });

    try {
      await taxSchema.validate({ tax_rate: formData.tax_rate });
      onSubmit(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" />
      </div>
      <div className="mb-6">
        <label htmlFor="tax_rate" className="block text-gray-700 text-sm font-bold mb-2">tax_rate:</label>
        <input type="text" name="tax_rate" value={formData.tax_rate} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="tax_rate" />
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
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

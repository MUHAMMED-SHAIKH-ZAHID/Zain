import { useState, useEffect } from 'react';

export const RouteForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ route: '', description: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({ route: initialData.route || '', description: initialData.description || '' });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;  // Corrected from route to name
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="route" className="block text-gray-700 text-sm font-bold mb-2">Route:</label>
        <input type="text" name="route" value={formData.route} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" />
      </div>
      <div className="flex items-center justify-between">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Cancel
        </button>
      </div>
    </form>
  );
};

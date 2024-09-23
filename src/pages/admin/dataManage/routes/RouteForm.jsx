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
    <form onSubmit={handleSubmit} className="">
      <div className="mb-4">
        <label htmlFor="route" className="block text-gray-700 text-sm font-medium mb-2">Route:</label>
        <input type="text" name="route" value={formData.route} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" />
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

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const BrandForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', category_id: '' });
  const { categories, loading } = useSelector(state => state?.categories?.categories);

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name || '', category_id: initialData.category_id || '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="mb-6">
        <label htmlFor="category_id" className="block text-gray-800 text-sm font-medium mb-2">Brand:</label>
        <select 
          name="category_id" 
          value={formData.category_id} 
          onChange={handleChange} 
          className="form-select w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
          id="category_id"
        >
          <option value="">Select a Brand</option>
          {!loading && categories && categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="name" className="block text-gray-800 text-sm font-medium mb-2">Category Name:</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          className="form-input w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
          id="name"
        />
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

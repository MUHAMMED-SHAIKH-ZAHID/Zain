import { useEffect, useState } from "react";

export const ExpenseForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ expense_type: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({ expense_type: initialData.expense_type || '' });
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
        <label htmlFor="expense_type" className="block text-gray-800 text-sm font-semibold mb-2">Expense Type:</label>
        <input 
          type="text" 
          name="expense_type" 
          value={formData.expense_type} 
          onChange={handleChange} 
          className="form-input w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
          id="expense_type" 
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

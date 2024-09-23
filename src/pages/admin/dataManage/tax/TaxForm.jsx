// import React, { useState, useEffect } from 'react';
// import { FaPlus, FaTrash } from 'react-icons/fa';
// import * as Yup from 'yup';

// export const TaxForm = ({ initialData = {}, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({ hsn_code: '', tax_rates: [{ tax_rate: '' }] });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         hsn_code: initialData.hsn_code || '',
//         tax_rates: initialData.tax_rates || [{ tax_rate: '' }],
//       });
//     }
//   }, [initialData]);

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleTaxRateChange = (index, value) => {
//     const newTaxRates = [...formData.tax_rates];
//     newTaxRates[1].tax_rate = value;
//     console.log(value,"chehckingg the new value",newTaxRates);
//     setFormData(prev => ({ ...prev, tax_rates: newTaxRates }));
//   };

//   const handleAddTaxRate = () => {
//     setFormData(prev => ({ ...prev, tax_rates: [...prev.tax_rates, { tax_rate: '' }] }));
//   };

//   const handleRemoveTaxRate = (index) => {
//     const newTaxRates = [...formData.tax_rates];
//     newTaxRates.splice(index, 1);
//     setFormData(prev => ({ ...prev, tax_rate: newTaxRates }));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
    
//     const taxSchema = Yup.object().shape({
//       tax_rates: Yup.array().of(
//         Yup.object().shape({
//           tax_rate: Yup.number().required('Tax rate is required').max(100, 'Tax rate cannot exceed 100%'),
//         })
//       ),
//       hsn_code: Yup.string()
//         .required('HSN code is required')
//         .max(15, 'Enter a valid HSN code Max 15 digits'),
//     });

//     try {
//       await taxSchema.validate(formData, { abortEarly: false });
//       setErrors({});
//       console.log(formData,"the formdata before submit");
//       onSubmit(formData);
//     } catch (err) {
//       if (err instanceof Yup.ValidationError) {
//         const validationErrors = {};
//         err.inner.forEach(error => {
//           validationErrors[error.path] = error.message;
//         });
//         setErrors(validationErrors);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="">
//       <div className="mb-4">
//         <label htmlFor="hsn_code" className="block text-gray-700 text-sm font-medium mb-2">HSN Code:</label>
//         <input 
//           type="text" 
//           name="hsn_code" 
//           value={formData.hsn_code} 
//           onChange={handleChange} 
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
//           id="hsn_code" 
//         />
//         {errors.hsn_code && <p className="text-red-500 text-xs italic">{errors.hsn_code}</p>}
//       </div>
//       <div className="col-span-3">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Tax Rates</label>
//         <div className="h-24 overflow-y-auto no-scrollbar">
//           {formData.tax_rates.map((rate, index) => (
//             <div key={index} className="flex items-center mb-2">
//               <input
//                 type="number"
//                 defaultValue={rate?.tax_rate}
//                 onChange={(e) => handleTaxRateChange(index, e.target.value)}
//                 className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 placeholder={`Tax Rate ${index + 1}`}
//               />
//               <button
//                 type="button"
//                 onClick={() => handleRemoveTaxRate(index)}
//                 className="ml-2 text-red-500 hover:text-red-700"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           ))}
//         </div>
//         <button
//           type="button"
//           onClick={handleAddTaxRate}
//           className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
//         >
//           <FaPlus className="mr-1" />
//           Add Tax Rate
//         </button>
//       </div>
//       <div className="flex items-center justify-end gap-2">
//         <button 
//           type="button" 
//           onClick={onCancel}
//           className="bg-gray-200 hover:bg-gray-300 text-black font-normal py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1"
//         >
//           Cancel
//         </button>
//         <button 
//           type="submit" 
//           className="bg-blue-500 hover:bg-blue-600 text-white font-normal py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1"
//         >
//           Submit
//         </button>
//       </div>
//     </form>
//   );
// };


import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import * as Yup from 'yup';

export const TaxForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ hsn_code: '', tax_rates: [{ tax_rate: '' }] });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        hsn_code: initialData.hsn_code || '',
        tax_rates: initialData.tax_rates || [{ tax_rate: '' }],
      });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTaxRateChange = (index, value) => {
    const newTaxRates = [...formData.tax_rates];
    newTaxRates[index].tax_rate = value;  // Update the correct index
    setFormData(prev => ({ ...prev, tax_rates: newTaxRates }));
  };

  const handleAddTaxRate = () => {
    setFormData(prev => ({ ...prev, tax_rates: [...prev.tax_rates, { tax_rate: '' }] }));
  };

  const handleRemoveTaxRate = (index) => {
    const newTaxRates = [...formData.tax_rates];
    newTaxRates.splice(index, 1);
    setFormData(prev => ({ ...prev, tax_rates: newTaxRates }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    const taxSchema = Yup.object().shape({
      tax_rates: Yup.array().of(
        Yup.object().shape({
          tax_rate: Yup.number().required('Tax rate is required').max(100, 'Tax rate cannot exceed 100%'),
        })
      ),
      hsn_code: Yup.string()
        .required('HSN code is required')
        .max(15, 'Enter a valid HSN code Max 15 digits'),
    });

    try {
      await taxSchema.validate(formData, { abortEarly: false });
      setErrors({});
      console.log(formData, "the formData before submit");
      onSubmit(formData);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="mb-4">
        <label htmlFor="hsn_code" className="block text-gray-700 text-sm font-medium mb-2">HSN Code:</label>
        <input 
          type="text" 
          name="hsn_code" 
          value={formData.hsn_code} 
          onChange={handleChange} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          id="hsn_code" 
        />
        {errors.hsn_code && <p className="text-red-500 text-xs italic">{errors.hsn_code}</p>}
      </div>
      <div className="col-span-3">
        <label className="block text-gray-700 text-sm font-bold mb-2">Tax Rates</label>
        <div className="h-24 overflow-y-auto no-scrollbar">
          {formData.tax_rates.map((rate, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="number"
                value={rate.tax_rate} // Use value to make it a controlled input
                onChange={(e) => handleTaxRateChange(index, e.target.value)}
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={`Tax Rate ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveTaxRate(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddTaxRate}
          className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
        >
          <FaPlus className="mr-1" />
          Add Tax Rate
        </button>
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

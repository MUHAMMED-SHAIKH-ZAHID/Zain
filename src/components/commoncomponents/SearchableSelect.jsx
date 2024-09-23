import React from 'react';
import Select from 'react-select';
import { useField, useFormikContext } from 'formik';

const SearchableSelect = ({ label, options, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;
  const { setTouched } = useFormikContext();

  const handleChange = selectedOption => {
    setValue(selectedOption ? selectedOption.value : '');
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div className='w-full'>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Select
        {...field}
        {...props}
        options={options}
        onChange={handleChange}
        onBlur={handleBlur}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      {meta.touched && meta.error ? (
        <p className="text-red-500 text-xs italic">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default SearchableSelect;

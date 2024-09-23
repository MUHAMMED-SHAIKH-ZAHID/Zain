import React from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createCategory } from '../../../../redux/features/DataManageSlices/CategorySlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Category name is required'),
});

const CreateCategory = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(createCategory(values));
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type="text"
        name="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
        placeholder="Enter category name"
      />
      {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}
      <button type="submit">Create Category</button>
    </form>
  );
};

export default CreateCategory;

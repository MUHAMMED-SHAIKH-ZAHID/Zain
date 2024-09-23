import React from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateCategory } from '../../../../redux/features/DataManageSlices/CategorySlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Category name is required'),
});

const UpdateCategory = ({ category }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: category.name,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateCategory({ id: category.id, ...values }));
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
      <button type="submit">Update Category</button>
    </form>
  );
};

export default UpdateCategory;

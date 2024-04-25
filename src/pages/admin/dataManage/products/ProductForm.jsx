import React, { useEffect, useState } from 'react';

const ProductForm = ({ initialData = {}, onSubmit, onCancel, categories, brands }) => {
    const [formData, setFormData] = useState({
        product_name: '',
        hsn_code: '',
        ean_code: '',
        category_id: '',
        brand_id: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                product_name: initialData.product_name || '',
                hsn_code: initialData.hsn_code || '',
                ean_code: initialData.ean_code || '',
                category_id: initialData.category_id || '',
                brand_id: initialData.brand_id || ''
            });
        }
    }, [initialData]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Product Name</label>
                <input
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>HSN Code</label>
                <input
                    name="hsn_code"
                    value={formData.hsn_code}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>EAN Code</label>
                <input
                    name="ean_code"
                    value={formData.ean_code}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Category</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange}>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Brand</label>
                <select name="brand_id" value={formData.brand_id} onChange={handleChange}>
                    {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                    ))}
                </select>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ProductForm;

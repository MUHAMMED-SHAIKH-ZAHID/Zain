import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddItemsForm from './AddItemsForm'; // Ensure this component is implemented
import Modal from '../../../../components/commoncomponents/Modal';

// Schema for the main form validation
const purchaseSchema = Yup.object({
  purchaseId: Yup.string().required('Purchase ID is required'),
  supplier: Yup.string().required('Supplier is required'),
  purchaseDate: Yup.date().nullable().required('Purchase date is required'),
});


const AddPurchase = () => {
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Full');
    const [paidAmount, setPaidAmount] = useState(0);
    const [dueDate, setDueDate] = useState(new Date());
    const [modeOfTransaction, setModeOfTransaction] = useState('');
    const [notes, setNotes] = useState('');
    
    useEffect(() => {
        const newTotal = items.reduce((acc, item) => acc + (item.qty * item.price * (1 + item.tax / 100)), 0);
        setTotal(newTotal);
        setGrandTotal(newTotal - (newTotal * discount / 100));
      }, [items, discount]);

      const balanceAmount = grandTotal - paidAmount;


      const formik = useFormik({
        initialValues: {
          purchaseDate: new Date(),
          purchaseId: '',
          supplier: '',
        },
        onSubmit: (values) => {
          // Prepare all data for submission
          const formData = {
            ...values,
            items,
            total,
            discount,
            grandTotal,
            paymentMethod,
            paidAmount,
            balanceAmount: grandTotal - paidAmount,
            dueDate,
            modeOfTransaction,
            notes
          };
          console.log('Final Submission:', formData);
          // Here you would typically send this data to the server
        },
      });

   // Function to remove an item from the list
   const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Compute total price for an item including tax
  const computeTotalPrice = (item) => {
    return (item.qty * item.price * (1 + item.tax / 100)).toFixed(2);
  };

  return (
    <div className="  p-5">
      <h2 className="text-xl font-bold mb-5 text-center">Create Purchase</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex justify-between">

        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">Date:</label>
          <DatePicker
            selected={formik.values.purchaseDate}
            onChange={(date) => formik.setFieldValue('purchaseDate', date)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="purchaseId" className="block text-sm font-medium text-gray-700">Purchase ID:</label>
          <input
            id="purchaseId"
            type="text"
            {...formik.getFieldProps('purchaseId')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        </div>
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Supplier:</label>
          <select
            id="supplier"
            {...formik.getFieldProps('supplier')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a supplier</option>
            <option value="supplier1">Supplier 1</option>
            <option value="supplier2">Supplier 2</option>
          </select>
        </div>
        <button type="button" onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Items
        </button>
     
     

     

      {/* Items Table */}
      {items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Items Added</h3>
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EAN</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inbound</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exbound</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ean}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.inbound}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.exbound}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tax}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{computeTotalPrice(item)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDeleteItem(index)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            

          </div>
        </div>
      )}
            <div className="flex gap-4 justify-end mt-5">
  {/* Total Display */}
  <div>
    <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total:</label>
    <input
      id="total"
      type="text"
      value={total.toFixed(2)}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>

  {/* Discount Input */}
  <div>
    <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%):</label>
    <input
      id="discount"
      type="text"
      placeholder="Enter discount"
      value={discount}
      onChange={(e) => setDiscount(parseFloat(e.target.value))}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>

  {/* Grand Total Display */}
  <div>
    <label htmlFor="grandTotal" className="block text-sm font-medium text-gray-700">Grand Total:</label>
    <input
      id="grandTotal"
      type="text"
      value={grandTotal.toFixed(2)}
      disabled
      className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
</div>

     <div className="grid grid-cols-3 gap-3 mt-10">
     <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Full">Full</option>
            <option value="Advance">Advance</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        {['Advance', 'Credit'].includes(paymentMethod) && (
          <>
            <div>
              <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700">Paid Amount:</label>
              <input
                type="number"
                id="paidAmount"
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="balanceAmount" className="block text-sm font-medium text-gray-700">Balance Amount:</label>
              <input
                type="text"
                id="balanceAmount"
                value={balanceAmount.toFixed(2)}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date:</label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </>
        )}
            <div>
          <label htmlFor="modeOfTransaction" className="block text-sm font-medium text-gray-700">Mode of Transaction:</label>
          <select
            id="modeOfTransaction"
            value={modeOfTransaction}
            onChange={(e) => setModeOfTransaction(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Online">Online</option>
          </select>
        </div>
     </div>
          <div className='my-6'>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add any relevant notes here..."
          />
        </div>
        <div className="flex justify-center my-4">   <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Submit Purchase
        </button></div>
        </form>
         {/* Modal for adding items */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Add Items to Purchase"
        content={<AddItemsForm items={items} setItems={setItems} onClose={() => setShowModal(false)} />}
      />
    </div>
  );
};

export default AddPurchase;

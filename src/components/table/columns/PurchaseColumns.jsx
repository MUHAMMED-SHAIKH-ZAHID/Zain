import { IoPrint } from 'react-icons/io5';
import { MdVisibility, MdEdit, MdDelete, MdOutlinePayment } from 'react-icons/md';
import { VscDebugRestart } from 'react-icons/vsc';

const PurchaseColumns = ( paymentActionClick,returnActionClick, viewActionClick, editActionClick, printActionClick, deleteActionClick) => [
  
  { Header: "Id", accessor: 'id' },
  { Header: "Supplier Name", accessor: 'supplier_name' },
  { Header: "Purchase Number", accessor: 'purchase_number' },
  {
    Header: 'Total Amount',
    accessor: 'grand_total'
  },
  {
    Header: 'Payment Due Date',
    accessor: 'payment_due_date'
  },

  {
    Header: () => (
      <div className='text-center ml-32'>Actions</div> // Text is centered for consistency
    ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-2 items-center'>
        <button onClick={() => paymentActionClick(row.original)} className='flex items-center  text-blue-500 underline py-1 px-3 rounded shadow'>
          <MdOutlinePayment className="text-lg " /> Payment
        </button>
        <button onClick={() => returnActionClick(row.original)} className='flex items-center bg-gray-600 hover:bg-black text-white py-1 px-3 rounded shadow'>
          <VscDebugRestart className="text-lg " />
        </button>
        <button onClick={() => viewActionClick(row.original)} className='flex items-center bg-gray-600 text-center hover:bg-black text-white py-1 px-3 rounded shadow'>
          <MdVisibility className="text-lg" /> 
        </button>
        <button
          onClick={() => editActionClick(row.original)}
          className='flex items-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow'
        >
          <MdEdit className="text-lg" />
        </button>
        <button
          onClick={() => printActionClick(row.original)}
          className='flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-3 text-xs rounded shadow'
        >
          <IoPrint className="" /> 
        </button>
        <button
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            deleteActionClick(row.original);
          }}
          className='flex items-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow'
        >
          <MdDelete className="text-lg" />
        </button>
      </div>
    ),
  }
];


export { PurchaseColumns };

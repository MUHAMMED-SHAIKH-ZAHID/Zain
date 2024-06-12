import { IoPrint } from 'react-icons/io5';
import { MdVisibility, MdEdit, MdDelete, MdOutlinePayment } from 'react-icons/md';
import { VscDebugRestart } from 'react-icons/vsc';

const PurchaseColumns = (  viewActionClick, editActionClick, printActionClick, deleteActionClick) => [
  
  { Header: "Id", accessor: 'id' },
  { Header: "Date", accessor: 'purchase_date' },
  { Header: "Vendor Name", accessor: 'supplier_name' },
  {
    Header: 'Bill#',
    accessor: 'bill_number'
  },
  {
    Header: 'Amount',
    accessor: 'grand_total'
  },
  {
    Header: 'Paid',
    accessor: 'paid_amount'
  },
  {
    Header: 'Balance',
    accessor: 'payment_balance'
  },
  {
    Header: 'Due Date',
    accessor: 'payment_due_date'
  },

  {
    Header: () => (
      <div className='text-center ml-32'>Actions</div> // Text is centered for consistency
    ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-4 items-center'>
        {/* <button onClick={() => paymentActionClick(row.original)} className='flex items-center  text-blue-500 underline py-1 px-3 rounded shadow'>
          <MdOutlinePayment className="text-lg " /> Payment
        </button>
        <div className="relative group">

        <button onClick={() => returnActionClick(row.original)} className=''>
          <VscDebugRestart className="text-xl text-red-700 " />
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2  w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Return
        </div>
        </button>
        </div> */}
      <div className="relative group">
        <button onClick={() => viewActionClick(row.original)} className=''>
          <MdVisibility className="text-xl text-green-800 " />
        </button>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2  w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View
        </div>
      </div>
      <div className="relative group">
        <button onClick={() => editActionClick(row.original)} className=''>
          <MdEdit className="text-blue-500  text-xl" />
        </button>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2  w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Edit
        </div>
      </div>
      <div className="relative group ">
        <button onClick={() => printActionClick(row.original)} className=''>
          <IoPrint className="text-xl" />
        </button>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2  w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Print
        </div>
      </div>
    
        {/* <button
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            deleteActionClick(row.original);
          }}
          className='flex items-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow'
        >
          <MdDelete className="text-lg" />
        </button> */}
      </div>
    ),
  }
];


export { PurchaseColumns };

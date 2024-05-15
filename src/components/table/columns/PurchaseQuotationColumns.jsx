import { IoPrint } from 'react-icons/io5';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { TbStatusChange } from 'react-icons/tb';

const PurchaseQuotationColumns = (convertActionClick, viewActionClick, editActionClick, printActionClick, deleteActionClick) => [
  
  { Header: "Id", accessor: 'id' },
  { Header: "Quote Number", accessor: 'purchase_order_number' },
  { Header: "Supplier Name", accessor: 'supplier_name' },
  {
    Header: 'Total Amount',
    accessor:'grand_total'
  },
  { Header: "Generated Date", accessor: 'created_at' },
  {
    Header: 'Order Status',
    accessor:'order_status',
    Cell: ({ value }) => {
      return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(value)}`}>
          {value}
        </span>
      );
    }
  },
  {
    Header: () => (
        <div className='text-center ml-32'>Actions</div> // Text is centered for consistency
      ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-2 items-center'>
        <button onClick={() => convertActionClick(row.original)} className='flex items-center bg-gray-400 hover:bg-gray-700 text-white py-1 px-3 rounded shadow'>
          <TbStatusChange className="text-lg " /> 
        </button>
        <button onClick={() => viewActionClick(row.original)} className='flex items-center bg-gray-600 hover:bg-black text-white py-1 px-3 rounded shadow'>
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

// Helper function to determine badge classes based on status
const getStatusBadgeClasses = (status) => {
  switch (status) {
    case 'approve':
      return 'bg-green-500 text-white '; // Green background for "approve" status with glowing effect
    case 'pending':
      return 'bg-yellow-500 text-white '; // Yellow background for "pending" status with glowing effect
    default:
      return 'bg-gray-500 text-white'; // Default gray background for other statuses
  }
};

export { PurchaseQuotationColumns };

import { IoPrint } from 'react-icons/io5';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

const SalesQuotationColumns = (viewActionClick, editActionClick, printActionClick, deleteActionClick) => [
  {
    Header: "ID",
    accessor: 'id',
  },
  // {
  //   Header: "Invoice Number",
  //   accessor: 'invoice',
  // },
  {
    Header: "Generated Date",
    accessor: 'created_at',
  },
  {
    Header: "Quote Number",
    accessor: 'quotation_number',
  },
  {
    Header: "Total Amount",
    accessor: 'grand_total',
  },
  {
    Header: "Status",
    accessor: 'quotation_status',
    Cell: ({ row }) => (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.original.quotation_status)}`}>
        {row.original.quotation_status}
      </span>
    ),
  },
  {
    Header: () => (
      <div className='text-center ml-20'>Actions</div> // Text is centered for consistency
    ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-1 items-center'>
        <button onClick={() => viewActionClick(row.original)} className='flex items-center bg-gray-600 hover:bg-black text-white py-1 px-3 rounded shadow'>
          <MdVisibility className="text-lg mr-2" /> View
        </button>
        <button
          onClick={() => editActionClick(row.original)}
          className='flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 text-xs rounded shadow'
        >
          <MdEdit className="" />
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
          className='flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-3 text-xs rounded shadow'
        >
          <MdDelete className="" />
        </button>
      </div>
    ),
  }
];

// Helper function to determine badge color based on status
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500 text-white'; // Yellow background for "hold" status
    case 'approve':
      return 'bg-blue-500 text-white'; // Blue background for "place" status
    case 'transit':
      return 'bg-green-500 text-white'; // Green background for "transit" status
    default:
      return 'bg-gray-500 text-white'; // Gray background for other statuses
  }
};

export { SalesQuotationColumns };

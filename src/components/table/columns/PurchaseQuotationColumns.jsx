import { IoPrint } from 'react-icons/io5';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { TbStatusChange } from 'react-icons/tb';

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const PurchaseQuotationColumns = ( viewActionClick, editActionClick, printActionClick, deleteActionClick) => [
  
  { Header: "Id", accessor: 'id' },
  { Header: "Order Number", accessor: 'purchase_order_number' },
  { Header: "Name", accessor: 'supplier_name' },
  {
    Header: ' Amount',
    accessor:'grand_total'
  },
  { Header: "Date", accessor: row => `${formatDate(row.created_at)}`},
  // {
  //   Header: 'Order Status',
  //   accessor:'order_status',
  //   Cell: ({ value }) => {
  //     return (
  //       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(value)}`}>
  //         {value}
  //       </span>
  //     );
  //   }
  // },
  {
    Header: () => (
        <div className='text-end mr-5'>Actions</div> // Text is centered for consistency
      ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-4 items-center '>
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

import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const salesColumns = (editActionClick  ,deleteActionClick  ) => [
  {
    Header: "ID",
    accessor: 'orderID',
  },
  {
    Header: "Invoice Number",
    accessor: 'invoice',
  },
  {
    Header: "Generated Date",
    accessor: 'generatedDate',
  },
  {
    Header: "Dealer Name",
    accessor: 'dealername',
  },
  {
    Header: "Total Amount",
    accessor: 'totalamount',
  },
  {
    Header: "Total Incl Gst",
    accessor: 'totalinclgst',
  },
  {
    Header: () => (
      <div className='text-center'>Actions</div> // Text is centered for consistency
    ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-1 items-center'>
        <Link to='/supplier/profile' className='flex items-center bg-gray-600 hover:bg-black text-white py-1 px-3 text-[.8rem] text-xs rounded shadow'>
          <MdVisibility className="mr-1 " /> View
        </Link>
        <button
          onClick={() => editActionClick(row.original)}
          className='flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 text-xs rounded shadow'
        >
          <MdEdit className="" /> 
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

export { salesColumns };

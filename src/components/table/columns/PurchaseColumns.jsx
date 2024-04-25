import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const PurchaseColumns = (editActionClick, deleteActionClick) => [
  { Header: "Id", accessor: 'id' },
  { Header: "Supplier Name", accessor: 'supplier_name' },
  { Header: "Purchase Number", accessor: 'purchase_number' },
  {
    Header: 'Total Amount',
    accessor:'grand_total'
  },
  {
    Header: 'Payment Balance',
    accessor:'payment_balance'
  },
  // {
  //   Header: "Status",
  //   accessor: 'status',
  //   Cell: ({ value }) => {
  //     const statusToBadgeClass = {
  //       Transit: "bg-yellow-100 text-yellow-800",
  //       Placed: "bg-green-100 text-green-800",
  //       Partial: "bg-orange-100 text-orange-800",  // Assuming statuses are one word; adjust as per your data
  //       Hold: "bg-red-100 text-red-800",
  //     };
  //     return (
  //       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusToBadgeClass[value] || 'bg-gray-100 text-gray-800'}`}>
  //         {value}
  //       </span>
  //     );
  //   }
  // },
  {
    Header: () => (
        <div className='text-center ml-32'>Actions</div> // Text is centered for consistency
      ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-2 items-center'>
        <Link to='/supplier/profile' className='flex items-center bg-gray-600 hover:bg-black text-white py-1 px-3 rounded shadow'>
          <MdVisibility className="text-lg mr-2" /> View
        </Link>
        <button
          onClick={() => editActionClick(row.original)}
          className='flex items-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow'
        >
          <MdEdit className="text-lg" />
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

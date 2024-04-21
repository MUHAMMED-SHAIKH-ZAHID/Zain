import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const CustomerColumns = (editActionClick, deleteActionClick) => [
  {
    Header: "Full Name",
    accessor: 'name',
  },
  {
    Header: "Email",
    accessor: 'email',
  },
  {
    Header: "Company",
    accessor: 'companyName',
  },
  {
    Header: "Location",
    accessor: 'state',
  },
  {
    Header: () => <div className='text-center'>Actions</div>,
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-1 items-center'>
        <Link to={`/user/customer/profile/${row.original.id}`} className='flex items-center bg-gray-600 hover:bg-black text-white py-1 px-3 text-xs rounded shadow'>
          <MdVisibility className="mr-1" /> View
        </Link>
        <button
          onClick={() => editActionClick(row.original)}
          className='flex items-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 text-xs rounded shadow'
        >
          <MdEdit /> Edit
        </button>
        <button
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            deleteActionClick(row.original);
          }}
          className='flex items-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 text-xs rounded shadow'
        >
          <MdDelete /> Delete
        </button>
      </div>
    ),
  }
];

export { CustomerColumns };

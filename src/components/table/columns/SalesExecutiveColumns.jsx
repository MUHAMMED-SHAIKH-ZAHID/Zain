import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const SalesExecutiveColumns = (editActionClick, deleteActionClick) => [
  {
    Header: "Name",
    accessor: 'name',
  },
  {
    Header: "Email",
    accessor: 'email',
  },
  {
    Header: "Mobile",
    accessor: 'mobile',
  },
  {
    Header: "Role",
    accessor: 'role',
  },
  {
    Header: () => <div className='text-center'>Actions</div>, // Centralized header text
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-2 items-center'>
        <Link to='/supplier/profile' className='flex items-center bg-gray-600 hover:bg-black text-white py-1 px-3 rounded shadow'>
          <MdVisibility className="mr-2" />View
        </Link>
        <button
          type="button"
          onClick={() => editActionClick(row.original)}
          className='flex items-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow'
        >
          <MdEdit className="mr-2" />Edit
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            deleteActionClick(row.original);
          }}
          className='flex items-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow'
        >
          <MdDelete className="mr-2" />Delete
        </button>
      </div>
    ),
  }
];

export { SalesExecutiveColumns };

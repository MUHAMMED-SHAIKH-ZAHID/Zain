import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const SalesExecutiveColumns = (viewActionClick,editActionClick) => [
  {
    Header:'id',
    accessor:'id',
  },
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
    accessor: 'contact',
  },
  // {
  //   Header: "Role",
  //   accessor: 'role',
  // },
  {
    Header: () => (
      <div className=' flex justify-end'>Actions</div>
    ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end gap-3  items-center'>
        <div className="relative group">
          <button onClick={() => viewActionClick(row.original)} className=''>
            <MdVisibility className="text-xl text-green-800 " />
          </button>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View
          </div>
        </div>
        <div className="relative group">
          <button onClick={() => editActionClick(row.original)} className=''>
            <MdEdit className="text-blue-500 text-xl" />
          </button>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Edit
          </div>
        </div>
      </div>
    ),
  },
];

export { SalesExecutiveColumns };

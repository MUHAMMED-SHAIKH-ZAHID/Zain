import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const SalesExecutiveColumns = (viewActionClick,editActionClick, deleteActionClick) => [
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
  // {
  //   Header: "Role",
  //   accessor: 'role',
  // },
  {
    Header: () => (
      <div className='flex justify-end mr-[5rem]'>Actions</div> // Text is centered for consistency
    ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-1 items-center'>
        <button onClick={()  =>viewActionClick(row.original)} className='flex items-center text-center bg-gray-600 hover:bg-black leading-none text-xs text-white py-[6px] px-2 rounded shadow'>
            <MdVisibility className="text-lg mb-[2px] mr-[5px]" /> View
          </button>
        <button
          onClick={() => editActionClick(row.original)}
          className='flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 text-sm rounded shadow'
        >
          <MdEdit className="" /> 
        </button>
        <button
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            deleteActionClick(row.original);
          }}
          className='flex items-center bg-red-500 hover:bg-red-600  text-white py-2 px-3 text-sm rounded shadow'
        >
          <MdDelete className="" /> 
        </button>
      </div>
    ),
  }
];

export { SalesExecutiveColumns };

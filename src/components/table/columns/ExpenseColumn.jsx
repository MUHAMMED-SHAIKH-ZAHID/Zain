import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function truncateNote(note, wordLimit = 3) {
  if (!note) return '';
  const words = note.split(' ');
  if (words.length <= wordLimit) return note;
  return words?.slice(0, wordLimit).join(' ') + '...';
}

const expenseColumn = (viewActionClick,editActionClick) => [
  {
    Header: "Id",
    accessor: 'id',
  },
  {
    Header: "Expense Date",
    accessor: row => `${formatDate(row.created_at)}`,
  },
  {
    Header: "Expense Type",
    accessor: (row) => row.expense_type_name || row.expense_name,
  },
  {
    Header: "Payment Method",
    accessor: 'payment_method',
  },
  {
    Header: "Amount",
    accessor: 'amount',
  },
  {
    Header: () => (
      <div className='text-end'>Actions</div>
    ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-3 items-center'>
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

export { expenseColumn };

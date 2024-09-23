import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const paymentColumns = (viewActionClick, approveActionClick ) => [
  {
    Header: "Id",
    accessor: 'id',
  },
  {
    Header: "Date",
    accessor: row => formatDate(row.payment_date),
  },
  {
    Header: "Expense Types",
    accessor: 'reference_type',
  },
  {
    Header: "Total",
    accessor: 'total',
  },
  {
    Header: "Paid Amount",
    accessor: 'paid_amount',
  },
  {
    Header: "Balance Amount",
    accessor: 'due_amount',
  },
  {
    Header: "Payment Status",
    accessor: 'status',
    Cell: ({ row }) => (
      <>
        {row.original.status == 0 ? (
      <button onClick={() => approveActionClick(row.original)} className=''>
            <span className="bg-yellow-100 text-xs font-medium me-2 px-2.5 py-0.5 dark:bg-yellow-400 dark:text-yellow-100 border border-yellow-200 rounded-xl">
              Pending
            </span>
          </button>
        ) : (
          <span className="bg-green-100 text-xs font-medium me-2 px-2.5 py-0.5 cursor-default dark:bg-green-400 dark:text-green-200 border border-green-300 rounded-xl">
            Approved
          </span>
        )}
      </>
    ),
  },
  {
    Header: () => <div className='text-end'>Actions</div>,
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-3 items-center'>
        <div className="relative mx-5 group">
          <button onClick={() => viewActionClick(row.original)} className=''>
            <MdVisibility className="text-xl text-green-800" />
          </button>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View
          </div>
        </div>
        {/* Add other actions (Edit, Delete) if needed */}
      </div>
    ),
  },
];

export { paymentColumns };

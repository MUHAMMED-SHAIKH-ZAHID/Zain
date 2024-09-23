import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

const ExecutiveCustomerColumn = (viewActionClick,) => [
  {
    Header: "Code",
    accessor: 'code',
  },
  {
    Header: "Company Name",
    accessor: 'company_name',
  },
  {
    Header:"Sales Executive",
    accessor:"executive_name"
  },
  {
    Header:"Route",
    accessor:"route_name"
  },
  {
    Header: "Channel",
    accessor: 'channel_name',
  },
  {
    Header: "Email / Phone",
    accessor: "email",
    Cell: ({ row }) => (
      <div>
        <div>{row.original.email}</div>
        <div>{row.original.phone}</div>
      </div>
    )
  },
  {
    Header: "Created By",
    accessor: 'created_by',
  },
  {
    Header: "Payment Receivable",
    accessor: 'payment_receivable',
  },
  {
    Header: "Sales Total",
    accessor: 'sales_total',
  },
  {
    Header: "Balances",
    accessor: 'balance',
  },
  {
    Header: () => (
      <div className='text-center'>Actions</div>
    ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-3 items-center'>
        <div className="relative group">
        <button onClick={() => viewActionClick(row.original)} className=''>
          <MdVisibility className="text-xl text-green-800 " />
        </button>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2  w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View
        </div>
      </div>
  
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteActionClick(row.original);
          }}
          className='flex '
        >
          <MdDelete className="text-xl text-red-500" />
        </button> */}
      </div>
    ),
  },
];

export { ExecutiveCustomerColumn };

import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  

const paymentColumns = ( editActionClick) => [
    {
        Header: "Id",
        accessor: 'id',
      },
      {
        Header: "Date",
        accessor: row => `${formatDate(row.created_at)}`
      },
      {
        Header: "Expense Type",
        // accessor: row => `${row.suffix} ${row.first_name} ${row.last_name}`,
         accessor:'reference_type'
      },
      {
        Header: "Account",
        accessor: 'account_name',
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

//   {
//     Header: () => (
//       <div className='text-center'>Actions</div>
//     ),
//     accessor: "actions",
//     Cell: ({ row }) => (
//       <div className='flex justify-center space-x-1 items-center'>
//         {/* <button onClick={() => viewActionClick(row.original)} className='flex items-center text-center bg-gray-600 hover:bg-black leading-none text-xs text-white py-[6px] px-2 rounded shadow'>
//           <MdVisibility className="text-lg mb-[2px] mr-[5px]" /> View
//         </button> */}
//         <button
//           onClick={() => editActionClick(row.original)}
//           className='flex '
//         >
//           <MdEdit className="text-xl  text-blue-600" />
//         </button>
//         {/* <button
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             deleteActionClick(row.original);
//           }}
//           className='flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-3 text-sm rounded shadow'
//         >
//           <MdDelete className="" />
//         </button> */}
//       </div>
//     ),
//   },
];

export { paymentColumns };

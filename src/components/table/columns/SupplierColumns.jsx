import { MdVisibility, MdEdit } from 'react-icons/md';

const truncateToLastWords = (text, wordLimit) => {
  if (!text) return '';
  const words = text.split(' ');

  if (words.length === 1) {
    // No spaces found, treat characters as words
    const truncatedText = text?.slice(-wordLimit);
    return truncatedText.length < text.length ? '...' + truncatedText : truncatedText;
  }

  if (words.length > wordLimit) {
    return '...' + words?.slice(-wordLimit).join(' ');
  }
  return words.join(' ');
};

const suplierColumns = (viewActionClick, editActionClick) => [
  {
    Header: "Id",
    accessor: 'id',
  },
  {
    Header: "Company Name",
    accessor: 'company_name',
  },
  // {
  //   Header: "Vendor Name",
  //   accessor: row => `${row.suffix} ${row.first_name} `,
  // },
  {
    Header: "Email / Phone",
    accessor: "email",
    Cell: ({ row }) => (
      <div>
        <div>{row.original.email}</div>
        <div>{row.original.contact_number}</div>
      </div>
    )
  },
  {
    Header: "Pin Code",
    accessor: 'pin',
    
  },
  {
    Header: "Amount",
    accessor: 'purchase_total',
  },
  {
    Header: "Paid",
    accessor: 'paid_amount',
  },
  {
    Header: "Balances",
    accessor: 'balance_amount',
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

export { suplierColumns };

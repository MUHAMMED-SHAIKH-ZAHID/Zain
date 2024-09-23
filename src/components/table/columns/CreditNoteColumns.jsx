import { MdVisibility } from "react-icons/md";

const CreditNoteColumns = (viewActionClick) => [
    {
      Header: 'Date',
      accessor: 'credit_note_date',
    },
    {
      Header: 'Customer',
      accessor: 'customer_name',
    },
    {
      Header: 'Credit Note Number',
      accessor: 'credit_note_number',
    },
    // {
    //   Header: 'Notes',
    //   accessor: 'notes',
    // },
    {
      Header: 'Tax Amount',
      accessor: 'tax_amount',
    },
    {
      Header: 'Total Excluding Tax',
      accessor: 'total_excl_tax',
    },
    {
      Header: 'Grand Total',
      accessor: 'grand_total',
    },
    {
      Header: () => (
        <div className='text-end'>Actions</div>
      ),
      accessor: "actions",
      Cell: ({ row }) => (
        <div className='flex justify-end space-x-3 items-center'>
          <div className="relative mx-5 group">
            <button onClick={() => viewActionClick(row.original)} className=''>
              <MdVisibility className="text-xl text-green-800 " />
            </button>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View
            </div>
          </div>
        </div>
      ),
    },
  ];
  
  export default CreditNoteColumns;
  
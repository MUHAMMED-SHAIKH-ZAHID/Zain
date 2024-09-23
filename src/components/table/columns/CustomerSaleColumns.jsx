import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { VscDebugRestart } from 'react-icons/vsc';

const   CustomerSaleColumns = (viewActionClick,editActionClick  ,deleteActionClick  ) => [
 
    {
      Header:"Id",
      id: 'names',
      accessor:'id'
    },
    {
      Header: "Invoice Date",
      accessor: 'invoice_date',
    },
    {
      Header: "Invoice Number",
      accessor: 'invoice_number',
    },
 
  
    {
      Header: "Total",
      accessor: 'grand_total',
    },
    {
      Header: "Paid Amount",
      accessor: 'paid_amount',
    },
    {
      Header:"Payment due date",
      accessor: 'payment_due_date',
    },
{
  Header: () => (
    <div className='text-center'>Actions</div> // Text is centered for consistency
  ),
  accessor: "actions",
  Cell: ({ row }) => (
    <div className='flex justify-center space-x-1 items-center'>
  <div className="relative group">
        <button onClick={() => viewActionClick(row.original)} className=''>
          <MdVisibility className="text-xl text-green-800 " />
        </button>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2  w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View
        </div>
      </div>
      {/* <button
        onClick={() => editActionClick(row.original)}
        className='flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 text-xs rounded shadow'
      >
        <MdEdit className="" /> 
      </button>
      <button
        onClick={(e) => {
          e.preventDefault(); 
          e.stopPropagation();
          deleteActionClick(row.original);
        }}
        className='flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-3 text-xs rounded shadow'
      >
        <MdDelete className="" /> 
      </button> */}
    </div>
  ),
}

      
    
   
  ]
  
  export {CustomerSaleColumns}
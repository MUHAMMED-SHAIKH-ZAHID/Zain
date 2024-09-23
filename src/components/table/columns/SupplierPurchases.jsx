import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { VscDebugRestart } from 'react-icons/vsc';

const   SupplierPurchases = ( viewActionClick ) => [
 
    {
      Header:"Id",
      id: 'names',
      accessor:'id'
    },
    {
      Header: "Bill Number",
      accessor: 'bill_number',
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
      Header: "Payment Balance",
      accessor: 'payment_balance',
    },
    {
      Header:"Payment due date",
      accessor: 'payment_due_date',
    },
{
  Header: () => (
    <div className='text-center'>Actions</div> 
  ),
  accessor: "actions",
  Cell: ({ row }) => (
    <div className='flex justify-center space-x-1 items-center'>
          <div className="relative group">
          <button onClick={() => viewActionClick(row.original)} className=''>
            <MdVisibility className="text-xl text-green-800 " />
          </button>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View
          </div>
        </div>
    </div>
  ),
}

      
    
   
  ]
  
  export {SupplierPurchases}
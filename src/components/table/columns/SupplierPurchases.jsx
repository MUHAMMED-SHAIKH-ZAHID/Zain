import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { VscDebugRestart } from 'react-icons/vsc';

const   SupplierPurchases = (  ) => [
 
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
// {
//   Header: () => (
//     <div className='text-center'>Actions</div> // Text is centered for consistency
//   ),
//   accessor: "actions",
//   Cell: ({ row }) => (
//     <div className='flex justify-center space-x-1 items-center'>
//       <button onClick={()  =>viewActionClick(row.original)} className='flex items-center bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded shadow'>
//          <div className=" flex items-center text-center gap-2">  <VscDebugRestart  className="text-lg ml-2 " /> Return </div>
//         </button>
//       {/* <button
//         onClick={() => editActionClick(row.original)}
//         className='flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 text-xs rounded shadow'
//       >
//         <MdEdit className="" /> 
//       </button>
//       <button
//         onClick={(e) => {
//           e.preventDefault(); 
//           e.stopPropagation();
//           deleteActionClick(row.original);
//         }}
//         className='flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-3 text-xs rounded shadow'
//       >
//         <MdDelete className="" /> 
//       </button> */}
//     </div>
//   ),
// }

      
    
   
  ]
  
  export {SupplierPurchases}
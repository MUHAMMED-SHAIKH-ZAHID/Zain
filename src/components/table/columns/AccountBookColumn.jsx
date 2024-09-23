import { Link } from "react-router-dom";
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md'

const   AccountBookColumns = (viewActionClick,editActionClick  ,deleteActionClick  ) => [
 
    {
      Header:"Id",
      id: 'names',
      accessor:'id'
    },
    {
      Header: "Date",
      accessor: 'payment_date',
    },
    {
      Header: "Reeferense Type ",
      accessor: 'reference_type',
    },
  
    {
      Header: "Amount",
      accessor: 'paid_amount',
    },
 
    // {
    //   Header: "Location",
    //   accessor: 'location_name',
    // },
// {
//   Header: () => (
//     <div className='text-center'>Actions</div> // Text is centered for consistency
//   ),
//   accessor: "actions",
//   Cell: ({ row }) => (
//     <div className='flex justify-end space-x-1 items-center'>
//       <button onClick={()  =>viewActionClick(row.original)} className='flex items-center bg-gray-600 hover:bg-black text-white py-1 px-3 rounded shadow'>
//           <MdVisibility className="text-lg mr-2" /> View
//         </button>
//       <button
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
//       </button>
//     </div>
//   ),
// }

      
    
   
  ]
  
  export {AccountBookColumns}
import { IoPrint } from 'react-icons/io5';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const SalesQuotationColumns = (viewActionClick, editActionClick, printActionClick,) => [
  {
    Header: "ID",
    accessor: 'id',
  },
  {
    Header: "Order Number",
    accessor: 'sale_order_number',
  },
  {
    Header: "Company Name",
    accessor: 'company_name',
  },
  {
    Header: "Created by",
    accessor: 'created_by',
  },
  {
    Header: "Total Amount",
    accessor: 'grand_total',
  },
  { Header: "Date", accessor: 'quotation_date'  },

  {
    Header: () => (
        <div className='text-end mr-5'>Actions</div> // Text is centered for consistency
      ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-4 items-center '>
      <div className="relative group">
        <button onClick={() => viewActionClick(row.original)} className=''>
          <MdVisibility className="text-xl text-green-800 " />
        </button>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2  w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View
        </div>
      </div>
      <div className="relative group">
        <button onClick={() => editActionClick(row.original)} className=''>
          <MdEdit className="text-blue-500  text-xl" />
        </button>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2  w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Edit
        </div>
      </div>
      <div className="relative group ">
        <button onClick={() => printActionClick(row.original)} className=''>
          <IoPrint className="text-xl" />
        </button>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2  w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Print
        </div>
      </div>
    </div>
    ),
  }
];



export { SalesQuotationColumns };

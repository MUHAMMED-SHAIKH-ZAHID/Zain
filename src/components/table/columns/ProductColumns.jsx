import { MdVisibility, MdEdit } from 'react-icons/md';

const productColumns = (editActionClick) => [
  {
    Header: "Code",
    accessor: 'product_code',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "Name",
    accessor: 'product_name',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "Brand",
    accessor: 'category_name',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "Category",
    accessor: 'brand_name',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "EAN Code",
    accessor: 'ean_code',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "HSN",
    accessor: 'hsn_code',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "GST",
    accessor: 'tax_rate',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "MRP",
    accessor: 'mrp',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "P Price",
    accessor: 'p_rate',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[.6rem] font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "Retail",
    accessor: 's_rate_1',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[.6rem] font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "Dealer",
    accessor: 's_rate_2',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[.6rem] font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: "Wholesale",
    accessor: 's_rate_3',
    className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[.6rem] font-semibold text-gray-600 uppercase tracking-wider"
  },
  {
    Header: () => (
      <div className='text-center'>Actions</div>
    ),
    accessor: "actions",
    Cell: ({ row }) => (
      <div className='flex justify-end space-x-3 items-center'>
        {/* <div className="relative group">
          <button onClick={() => viewActionClick(row.original)} className=''>
            <MdVisibility className="text-xl text-green-800 " />
          </button>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-max px-2 py-[2px] text-[.6rem] text-white bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View
          </div>
        </div> */}
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

export { productColumns };

import { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import ModalManage from './ModalManage';
import { FaChevronDown } from 'react-icons/fa';

const DataTable = ({ data, columns, filterColumn, title }) => {
  const [filterValue, setFilterValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    // Ensure data is an array before filtering
    if (!Array.isArray(data)) return [];

    return data.filter((item) => {
      const searchMatch = Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const filterMatch = filterValue === '' || item[filterColumn]?.toString().toLowerCase().includes(filterValue.toLowerCase());
      return searchMatch && filterMatch;
    });
  }, [data, searchTerm, filterValue, filterColumn]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: itemsPerPage },
    },
    usePagination
  );

  useEffect(() => {
    setPageSize(itemsPerPage);
  }, [setPageSize, itemsPerPage]);

  useEffect(() => {
    gotoPage(0);
  }, [filteredData, gotoPage]);

  const formatText = (text) => {
    // Replace underscores with spaces
    const formattedText = text.replace(/_/g, ' ');
  
    // Capitalize first letter of each word
    const capitalizedText = formattedText.replace(/\b\w/g, (char) => char.toUpperCase());
  
    return capitalizedText;
  };
  

  return (
    <div className="container mx-auto mt-4 pt-4 px-4 pb-2 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3">
          <div className="">

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          </div>
          <div className="relative">

          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="px-3 py-2  pr-8 border appearance-none text-gray-500 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
<option className='' value="">Filter by {formatText(filterColumn)}</option>
            {[...new Set(data?.map(item => item[filterColumn]))].map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pr-3 pointer-events-none">
        <FaChevronDown className="text-gray-500 text-[10px]" />
      </div>
          </div>
        </div>
        <ModalManage title={title} />
      </div>
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={`text-[.9rem] ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f3f5f9]'} border-b`}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-md  text-gray-900">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pt-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Previous
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{pageIndex * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min((pageIndex + 1) * itemsPerPage, data.length)}</span> of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                {/* Icon for previous */}
              </button>
              {pageOptions.map(option => (
                <button
                  key={option}
                  onClick={() => gotoPage(option)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageIndex === option ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {option + 1}
                </button>
              ))}
              <button onClick={() => nextPage()} disabled={!canNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                {/* Icon for next */}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

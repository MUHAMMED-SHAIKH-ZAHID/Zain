import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import ModalManage from './ModalManage';

const DataTable = ({ data, columns, filterColumn ,title }) => {
  const [filterValue, setFilterValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchMatch = Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const filterMatch = filterValue === '' || item[filterColumn]?.toString().includes(filterValue);
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

  return (
    <div className="container mx-auto mt-2 p-2 rounded-lg">
      <div className="flex justify-between gap-2 mb-4">
        <div className=" flex gap-2">

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-400 rounded-md"
        />
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="px-4 py-2 font-semibold border text-[.8rem] border-gray-400 rounded uppercase"
        >
          <option value="">Filter by {filterColumn}</option>
          {[...new Set(data.map(item => item[filterColumn]))].map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        </div>
        <div className="">
            <ModalManage title={title} />
        </div>
      </div>
      <table {...getTableProps()} className="w-full table-auto">
        <thead className="bg-[#e9ecef] text-gray-900 text-[.8rem] border-b border-gray-300 uppercase">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="px-4 py-3 font-normal text-left">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={`text-[.9rem] ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f3f5f9]'} border-b`}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="px-4 py-3">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <nav aria-label="Pagination">
          <ul className="flex list-style-none">
            <li>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="px-3 py-1 rounded-l-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            </li>
            {pageOptions.map(option => (
              <li key={option}>
                <button
                  onClick={() => gotoPage(option)}
                  className={`px-3 py-1 border border-gray-300 bg-white hover:bg-gray-100 ${
                    pageIndex === option ? 'bg-gray-200 pointer-events-none' : ''
                  }`}
                >
                  {option + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DataTable;

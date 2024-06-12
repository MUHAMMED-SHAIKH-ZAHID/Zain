import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useTable, usePagination } from 'react-table';
import ModalManage from './ModalManage';
import { FaChevronDown } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';



const DataTableExports = ({ data, columns, filterColumn, title }) => {
  const [filterValue, setFilterValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [showPrint, setShowPrint] = useState(true)
  const { currentsupplier } = useSelector((state) => state?.supplier);


  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Invalid Date';
    try {
      const date = new Date(timestamp);
      return format(date, 'dd-MM-yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };


  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.filter((item) => {
      const searchMatch = Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const filterMatch = filterValue === '' || item?.[filterColumn]?.toString().toLowerCase().includes(filterValue.toLowerCase());
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
    const formattedText = text.replace(/_/g, ' ');
    const capitalizedText = formattedText.replace(/\b\w/g, (char) => char.toUpperCase());
    return capitalizedText;
  };

    const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'My Sheet');
    XLSX.writeFile(workbook, 'newreport.xlsx');
  };

  const getNestedValue = (obj, path) => {
    const keys = path.split(".");
    let value = obj;

    for (const key of keys) {
      if (value && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  };
  console.log(title," the Details Details")
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Remove "No" and "Actions" columns
    const modifiedColumns = columns.filter(
      (column) => column.Header !== "No" && column.Header !== "Actions"
    );
  
    // Prepare data for the PDF
    const pdfData = filteredData.map((row) => {
      return modifiedColumns.map((column) => {
        const value = getNestedValue(row, column.accessor);
        return column.accessor === "total" ? parseFloat(value) || 0 : value;
      });
    });
  
    // Format date in the PDF
    const formattedData = pdfData.map((row) => {
      const formattedRow = [...row];
      // Assuming the date column is the last one in each row
      const dateIndex = formattedRow.length - 1;
      formattedRow[dateIndex] = formatDate(formattedRow[dateIndex]);
      return formattedRow;
    });
  
    // Calculate total amount
    const totalAmount = formattedData.reduce((total, row) => {
      const rowTotal = parseFloat(row[modifiedColumns.findIndex((col) => col.accessor == "amount",)]);
      return total + (isNaN(rowTotal) ? 0 : rowTotal);
    }, 0);
    let Heading = ''
    if(title == 'Vendor'){
        Heading = `Name : ${currentsupplier?.first_name + " " +currentsupplier?.last_name   } `
    }

    const centerText = (doc, text, y) => {
        const textWidth = doc.getTextWidth(text);
        const pageWidth = doc.internal.pageSize.width;
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
      };
      
      // Define document metadata
      const heading = 'Zain Sales Corporation Vendor Report';
      
      // Set background color
      doc.setFillColor(0,0,0); // Light grey background
      doc.rect(0, 0, doc.internal.pageSize.width, 15, 'FD'); // Fill a rectangle
      
      // Add the heading
      doc.setFontSize(18);
      doc.setTextColor(255,255,255)
      centerText(doc, heading, 10);

    

// Add some details below the heading
doc.setTextColor(0,0,0)
doc.setFontSize(12);
doc.text(Heading, 14, 28);
doc.text(`Date: ${formatDate(Date.now())}`, 14, 34);

// Add some space before the table
const tableStartY = 40;
  
    // Add the table
    doc.autoTable({
      head: [modifiedColumns.map((column) => column.Header)],
      body: formattedData,
      startY: tableStartY
    },
);
  
  
    // Save the PDF
    doc.save("data.pdf");
  };

  return (
    <div className="container mx-auto mt-4 pt-4 px-4 pb-2  bg-white rounded-lg shadow">
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
              className="px-3 py-2 pr-8 border appearance-none text-gray-500 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Filter by {formatText(filterColumn)}</option>
              {[...new Set(data?.map(item => item?.[filterColumn]))].map((value, index) => (
                <option key={index} value={value}>{value}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pr-3 pointer-events-none">
              <FaChevronDown className="text-gray-500 text-[10px]" />
            </div>
          </div>
        </div>
        <div className="">
        {showPrint && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-[.7rem] md:text-[1rem] p-3 rounded-md leading-none flex items-center"
            onClick={toggleDropdown}
          >
            Download Options
            <svg
              className="ml-2 -mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.293l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414-1.414L10 11.707l-4.707-4.707z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isOpen && (
            <div
              className={`absolute top-full left-0 w-full bg-white shadow-md rounded overflow-hidden transition duration-150 ease-in-out transform ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <ul className="py-1">
                <li>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleExportExcel}
                  >
                    Export to Excel
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={generatePDF}
                  >
                    Print PDF
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
        <ModalManage title={title} />
        </div>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="px-4 py-3 text-left  text-xs font-[500] text-gray-400 uppercase tracking-wider" key={column.id}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200 ">
            {page.length > 0 ? (
              page.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className={`text-[.9rem]  ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f3f5f9]'} border-b`} key={row.id}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-4 py-4 whitespace-nowrap leading-none text-md text-gray-900" key={cell.column.id}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
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
            Showing <span className="font-medium">{data?.length > 0 ? pageIndex * itemsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min((pageIndex + 1) * itemsPerPage, data?.length || 0)}</span> of <span className="font-medium">{data?.length || 0}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button onClick={() => previousPage()} disabled={!canPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
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
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableExports;

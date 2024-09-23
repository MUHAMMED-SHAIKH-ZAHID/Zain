import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useTable, usePagination } from 'react-table'
import ModalManage from './ModalManage'
import { FaChevronDown } from 'react-icons/fa'
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format, parseISO } from 'date-fns';
import SizeContext from 'antd/es/config-provider/SizeContext';
import { Header } from 'antd/es/layout/layout';

const DataTable = ({ data, columns, filterColumn, title, total, Export }) => {
	const [filterValue, setFilterValue] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [showPrint, setShowPrint] = useState(true)
	const [isOpen, setIsOpen] = useState(false);
	const itemsPerPage = 10

	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);


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
		if (!Array.isArray(data)) return []

		return data.filter(item => {
			const searchMatch = Object.values(item)
				.join(' ')
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
			const filterMatch =
				filterValue === '' ||
				item?.[filterColumn]
					?.toString()
					.toLowerCase()
					.includes(filterValue.toLowerCase())
			return searchMatch && filterMatch
		})
	}, [data, searchTerm, filterValue, filterColumn])

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
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data: filteredData,
			initialState: { pageIndex: 0, pageSize: itemsPerPage },
		},
		usePagination
	)

	useEffect(() => {
		setPageSize(itemsPerPage)
	}, [setPageSize, itemsPerPage])

	useEffect(() => {
		gotoPage(0)
	}, [filteredData, gotoPage])

	const formatText = (text) => {
		const formattedText = text?.replace(/_/g, ' ');
		const capitalizedText = formattedText?.replace(/\b\w/g, (char) => char?.toUpperCase());
		return capitalizedText;
	};

	const handleExportExcel = async () => {
		const processdata = await beforedownload()
		const worksheet = XLSX.utils.json_to_sheet(processdata);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'My Sheet');
		XLSX.writeFile(workbook, `${title}.xlsx`);
	};

	const getNestedValue = (obj, path) => {
		if (!obj || !path) return undefined;

		const keys = path.split('.');
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

	const generatePDF = () => {
		const doc = new jsPDF();
		const modifiedColumns = columns.filter(
			(column) => column.Header !== "No" && column.Header !== "Actions" && column.accessor !== "actions"
		);
		const pdfData = filteredData.map((row) => {
			return modifiedColumns.map((column) => {
				const accessor = typeof column.accessor === 'string' ? column.accessor : '';
				const value = getNestedValue(row, accessor);
				if (title == "Purchase Ledger") {
					if (column.Header == "Balance") {
						return `${Number(row.opening_balance).toFixed(2)}`
					}
				}
				if (title == 'Customer ledger') {
					if (column.Header == "Date") {
						return `${formatDate(row.created_at)}`
					}
					if (column.Header == "Particulars") {
						return `${row.reference_type === 'sales' || row.reference_type === 'creditnote' ? row.reference_type : row.payment_mode}`
					}
					if (column.Header == "Debit") {
						return `${row.reference_type === 'sales' ? row.grand_total : ""}`
					}
					if (column.Header == "Credit") {
						return `${row.reference_type === 'payment' ? row.paid_amount : row.reference_type === 'creditnote' ? row.grand_total : ''}`
					}
				}
				if (title == 'Sales') {
					if (column.Header == "Date") {
						return `${formatDate(row.created_at)}`
					}
					if (column.Header == "Particulars") {
						return `${row.reference_type === 'purchase' || row.reference_type === 'debitnote' ? row.reference_type : row.payment_mode}`
					}
					if (column.Header == "Debit") {
						return `${row.reference_type === 'payment' ? row.paid_amount : row.reference_type === 'debitnote' ? row.grand_total : ''}`
					}
					if (column.Header == "Credit") {
						return `${row.reference_type === 'purchase' ? row.grand_total : ''}`
					}
				}
				if (title == 'Input Tax' || 'Output Tax' || "Sales Ledger") {
					if (column.Header == "Date") {
						return `${formatDate(row.created_at)}`
					}
					if (title == "Sales Ledger") {
						if (column.Header == "Balance") {
							return `${Number(row.opening_balance).toFixed(2)}`
						}
					}

					if (column.Header === "Balance") {
						return `${Number(row.tax_balance).toFixed(2)}`
					}
				}

				if (column.Header === "Vendor Name") {
					return `${row.suffix} ${row.first_name} `;
				}
				if (column.Header === 'Expense Date') {
					return `${formatDate(row.created_at)}`
				}
				if (column.Header === 'Expense Type') {
					return `${row.expense_type_name || row.expense_name}`
				}
				if (column.Header === 'Payment Status') {
					return `${row.status == '0' ? "Pending" : "Approved"}`
				}
				if (column.Header === 'Channel') {
					return `${row?.channel?.channel}`
				}
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
			const rowTotal = parseFloat(row[modifiedColumns.findIndex((col) => col.accessor === "amount")]);
			return total + (isNaN(rowTotal) ? 0 : rowTotal);
		}, 0);
		let Heading = '';
		if (title === 'Vendor') {
			Heading = `Name: ${currentsupplier?.first_name + " " + currentsupplier?.last_name}`;
		}

		const centerText = (doc, text, y) => {
			const textWidth = doc.getTextWidth(text);
			const pageWidth = doc.internal.pageSize.width;
			const x = (pageWidth - textWidth) / 2;
			doc.text(text, x, y);
		};

		// Define document metadata
		const heading = `Gnidertron Private Limited ${title} Report`;

		// Set background color
		doc.setFillColor(0, 0, 0); // Light grey background
		doc.rect(0, 0, doc.internal.pageSize.width, 15, 'FD'); // Fill a rectangle

		// Add the heading
		doc.setFontSize(18);
		doc.setTextColor(255, 255, 255);
		centerText(doc, heading, 10);

		// Add some details below the heading
		doc.setTextColor(0, 0, 0);
		doc.setFontSize(12);
		doc.text(Heading, 14, 28);
		doc.text(`Date: ${formatDate(Date.now())}`, 14, 34);

		// Add some space before the table
		const tableStartY = 40;
		// Add the table
		doc.autoTable({
			head: [modifiedColumns.map((column) => column.Header)],
			body: pdfData,
			startY: tableStartY,
		});
		// Save the PDF
		doc.save(`${title}.pdf`);
	};

	const beforedownload = async () => {
		return await new Promise((resolve) => {
			const modifiedColumns = columns.filter(
				(column) => column.Header !== "No" && column.Header !== "Actions" && column.accessor !== "actions"
			);
			const pdfData = filteredData.map((row) => {
				return modifiedColumns.map((column) => {
					const accessor = typeof column.accessor === 'string' ? column.accessor : '';
					const value = getNestedValue(row, accessor);
					if (title == "Purchase Ledger") {
						if (column.Header == "Balances") {
							return `${Number(row.opening_balance).toFixed(2)}`
						}
					}
					if (title == 'Customer ledger') {
						if (column.Header == "Date") {
							return `${formatDate(row.created_at)}`
						}
						if (column.Header == "Particulars") {
							return `${row.reference_type === 'sales' || row.reference_type === 'creditnote' ? row.reference_type : row.payment_mode}`
						}
						if (column.Header == "Debit") {
							return `${row.reference_type === 'sales' ? row.grand_total : ""}`
						}
						if (column.Header == "Credit") {
							return `${row.reference_type === 'payment' ? row.paid_amount : row.reference_type === 'creditnote' ? row.grand_total : ''}`
						}
					}
					if (title == 'Sales') {
						if (column.Header == "Date") {
							return `${formatDate(row.created_at)}`
						}
						if (column.Header == "Particulars") {
							return `${row.reference_type === 'purchase' || row.reference_type === 'debitnote' ? row.reference_type : row.payment_mode}`
						}
						if (column.Header == "Debit") {
							return `${row.reference_type === 'payment' ? row.paid_amount : row.reference_type === 'debitnote' ? row.grand_total : ''}`
						}
						if (column.Header == "Credit") {
							return `${row.reference_type === 'purchase' ? row.grand_total : ''}`
						}
					}
					if (title == 'Input Tax' || 'Output Tax' || "Sales Ledger") {
						if (column.Header == "Date") {
							return `${formatDate(row.created_at)}`
						}
						if (title == "Sales Ledger") {
							if (column.Header == "Balance") {
								return `${Number(row.opening_balance).toFixed(2)}`
							}
						}

						if (column.Header == "Balance") {
							return `${Number(row.tax_balance).toFixed(2)}`
						}
					}

					if (column.Header === "Vendor Name") {
						return `${row.suffix} ${row.first_name} `;
					}
					if (column.Header === 'Expense Date') {
						return `${formatDate(row.created_at)}`
					}
					if (column.Header === 'Expense Type') {
						return `${row.expense_type_name || row.expense_name}`
					}
					if (column.Header === 'Payment Status') {
						return `${row.status == '0' ? "Pending" : "Approved"}`
					}
					if (column.Header === 'Channel') {
						return `${row?.channel?.channel}`
					}
					return column.accessor === "total" ? parseFloat(value) || 0 : value;
				});
			});

			const joinArraysWithHeaders = (headers, ...columnSets) => {
				const result = [];
				for (const columns of columnSets) {
					if (columns.length !== headers.length) {
						throw new Error('All column sets must have the same length as headers.');
					}
					const row = {};
					for (let i = 0; i < headers.length; i++) {
						row[headers[i]] = columns[i];
					}
					result.push(row);
				}
				return result;
			};
			const joinedArray = joinArraysWithHeaders(modifiedColumns.map((column) => column.Header), ...pdfData);
			resolve(joinedArray);
		});
	};




	return (
		<div className='container mx-auto md:mt-4 p-2 md:pt-4 md:px-4 md:pb-2  min-w-full  bg-white rounded-lg shadow'>
			<div className='flex justify-between items-center md:mb-4 mb-2'>
				<div className='flex md:gap-3 gap-1'>
					<div className='md:mr-2 mr-1'>
						<input
							type='text'
							placeholder='Search...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='px-1 md:px-4 py-2 md:py-2 border md:w-full w-[5rem] border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
						/>
					</div>
					<div className={`${filterColumn === undefined && 'hidden'} relative flex items-center`}>
						<select
							value={filterValue}
							onChange={e => setFilterValue(e.target.value)}
							className='md:px-3 w-full px-1 md:py-2 py-1 md:pr-8 border appearance-none text-gray-500 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
						>
							<option value=''>Filter by {formatText(filterColumn)}</option>
							{[...new Set(data?.map(item => item?.[filterColumn]))].map((value, index) => (
								filterColumn === "status" ? (
									<option key={index} value={value}>
										{value == 0 ? 'Pending' : 'Approved'}
									</option>
								) : (
									<option key={index} value={value}>
										{value}
									</option>
								)
							))}
						</select>

						<div className='absolute inset-y-0 right-0 flex items-center px-2 pr-3 pointer-events-none'>
							<FaChevronDown className='text-gray-500 text-[10px]' />
						</div>
					</div>


				</div><div className="flex items-center  md:gap-3 gap-1">


					{showPrint && (
						<div className="relative flex items-center " ref={dropdownRef}>
							<button
								className="bg-blue-500 hover:bg-blue-600 text-white text-[.6rem] md:text-[.9rem] md:p-2 p-1  rounded-md leading-none  flex items-center"
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
									className={`absolute top-full left-0 w-full bg-white shadow-md rounded overflow-hidden transition duration-150 ease-in-out transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
										}`}
								>
									<ul className="py-1">
										<li>
											<button
												className="block w-full md:px-4 px-2 md:py-2 py-1 text-left text-[.6rem] md:text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
												onClick={handleExportExcel}
											>
												Export to Excel
											</button>
										</li>
										<li>
											<button
												className="block w-full md:px-4 px-2 md:py-2 py-1 text-left text-[.6rem] md:text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
			<div className='overflow-x-auto no-scrollbar w-full'>
				<table
					{...getTableProps()}
					className='min-w-full divide-y divide-gray-200'
				>
					<thead className='bg-gray-50'>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
								{headerGroup.headers.map(column => (
									<th
										{...column.getHeaderProps()}
										className='md:px-4 px-2 md:py-3 py-1 text-left  text-[.6rem] md:text-xs font-[500] text-gray-400 uppercase tracking-wider'
										key={column.id}
									>
										{column.render('Header')}
									</th>
								))}
							</tr>
						))}
					</thead>
					{total && (
						<tr>
							<td colSpan={5}>
								<div className='w-full flex justify-between p-1 md:p-2'>
									<h1 className='font-bold truncate'>Opening Balance :</h1>
									<h1 className='font-bold'>{total}</h1>
								</div>
							</td>
						</tr>
					)}
					<tbody
						{...getTableBodyProps()}
						className='bg-white divide-y divide-gray-200 '
					>
						{page.length > 0 ? (
							page.map((row, rowIndex) => {
								prepareRow(row)
								return (
									<tr
										{...row.getRowProps()}
										className={`md:text-[.9rem] text-[.6rem]  ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f3f5f9]'
											} border-b`}
										key={row.id}
									>
										{row.cells.map(cell => (
											<td
												{...cell.getCellProps()}
												className='md:px-4 md:py-4 py-1 px-1 whitespace-nowrap leading-none text-md text-gray-900'
												key={cell.column.id}
											>
												{cell.render('Cell')}
											</td>
										))}
									</tr>
								)
							})
						) : (
							<tr>
								<td
									colSpan={columns.length}
									className='px-6 py-4 text-center text-gray-500'
								>
									No data available
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div className="flex justify-between items-center py-2 md:py-3 text-gray-800">
  <span className="text-xs md:text-sm">
    Page {pageIndex + 1} of {" "}
    {pageOptions.length}  </span>
  
  <div className="flex gap-1 md:gap-2">
    {pageIndex > 0 && (
      <button
        onClick={() => gotoPage(0)}
        className="px-2 py-1 md:px-4 md:py-2 border border-gray-400 rounded-md text-xs md:text-sm hover:bg-gray-300 disabled:opacity-50"
      >
        {1}
      </button>
    )}

    {/* Previous Page Button */}
    <button
      onClick={() => previousPage()}
      disabled={!canPreviousPage}
      className="px-2 py-1 md:px-4 md:py-2 border border-gray-400 rounded-md text-xs md:text-sm hover:bg-gray-300 disabled:opacity-50"
    >
      {"<"}
    </button>

    {/* Current Page Button */}
    <span className="px-2 py-1 md:px-4 md:py-2 border border-gray-400 rounded-md text-xs md:text-sm bg-gray-200">
      {pageIndex + 1}
    </span>

    {/* Next Page Button */}
    <button
      onClick={() => nextPage()}
      disabled={!canNextPage}
      className="px-2 py-1 md:px-4 md:py-2 border border-gray-400 rounded-md text-xs md:text-sm hover:bg-gray-300 disabled:opacity-50"
    >
      {">"}
    </button>

    {/* Last Page Button */}
    {pageIndex < pageCount - 1 && (
      <button
        onClick={() => gotoPage(pageCount - 1)}
        className="px-2 py-1 md:px-4 md:py-2 border border-gray-400 rounded-md text-xs md:text-sm hover:bg-gray-300 disabled:opacity-50"
      >
        {pageCount}
      </button>
    )}
  </div>
</div>

		</div>
	)
}

export default DataTable

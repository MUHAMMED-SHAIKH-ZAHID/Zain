function formatDate(timestamp) {
	const date = new Date(timestamp)
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()
	return `${day}-${month}-${year}`
}

const InputTaxColumns = () => [
	{ Header: 'Date', accessor: row => formatDate(row.created_at) },
	{ Header: 'Bill', accessor: 'bill_number' },
	{ Header: 'Debit', accessor: 'tax_amount' },
	{ Header: 'Credit', accessor: '' },
	{ Header: 'Balance', accessor: row => Number(row.tax_balance).toFixed(2) },
]

export default InputTaxColumns

function formatDate(timestamp) {
	const date = new Date(timestamp)
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()
	return `${day}-${month}-${year}`
}

const purchaseLedgerColumns = () => [
	{ Header: 'Date', accessor: row => formatDate(row.created_at) },
	{ Header: 'Particulars', accessor: 'supplier.company_name' },
	{ Header: 'Debit', accessor: 'grand_total' },
	{ Header: 'Credit', accessor: '' },
	{ Header: 'Balance', accessor: row => Number(row.opening_balance).toFixed(2) },
]

export default purchaseLedgerColumns

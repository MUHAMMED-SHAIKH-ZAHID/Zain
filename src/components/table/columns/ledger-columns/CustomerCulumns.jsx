function formatDate(timestamp) {
	const date = new Date(timestamp)
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()
	return `${day}-${month}-${year}`
}

const costumerLedgerColumns = () => [
	{ Header: 'Date', accessor: row => formatDate(row.created_at) },
	{
		Header: 'Particulars',
		accessor: row =>
			row.reference_type === 'sales' || row.reference_type === 'creditnote' ? row.reference_type : row.payment_mode,
	},

	{
		Header: 'Debit',
		accessor: row => row.reference_type === 'sales'  ? row.grand_total : ""
	},
	{
		Header: 'Credit',
		accessor: row => {
			if (row.reference_type === 'payment') {
				return row.paid_amount
			} else if (row.reference_type === 'creditnote') {
				return row.grand_total
			} else {
				return
			}
		},
	},
	{ Header: 'Balances', accessor: 'payment_balance' },
]

export default costumerLedgerColumns

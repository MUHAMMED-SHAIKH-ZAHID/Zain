function formatDate(timestamp) {
	const date = new Date(timestamp)
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()
	return `${day}-${month}-${year}`
}

const VendorLedgerColumns = () => [
	{ Header: 'Date', accessor: row => formatDate(row.created_at) },
	{
		Header: 'Particulars',
		accessor: row =>
			row.reference_type === 'purchase' || row.reference_type === 'debitnote' ? row.reference_type : row.payment_mode,
	},
	{
		Header: 'Debit',
		accessor: row => {
			if (row.reference_type === 'payment') {
				return row.paid_amount
			} else if (row.reference_type === 'debitnote') {
				return row.grand_total
			} else {
				return
			}
		},
	},
	{
		Header: 'Credit',
		accessor: row => row.reference_type === 'purchase' && row.grand_total,
	},
	{ Header: 'Balances', accessor: 'payment_balance' },
]

export default VendorLedgerColumns

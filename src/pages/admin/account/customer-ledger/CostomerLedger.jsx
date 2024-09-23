import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCustomerLedger } from '../../../../redux/features/ledgerSlice'
import DataTable from '../../../../components/table/DataTable'
import { DateRangePicker } from 'react-date-range'
import costumerLedgerColumns from '../../../../components/table/columns/ledger-columns/CustomerCulumns'
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice'

const stripTime = date => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// import........................................................................................

function CostomerLedger() {
	const [loading, setLoading] = useState(false)
	const [customers, setCustomers] = useState([])
	const [customerLedger, setCustomerLedger] = useState([])
	const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.id)
	const [filteredData, setFilteredData] = useState(customerLedger)
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [isShow, setIsShow] = useState(false)
	const dispatch = useDispatch()
	const columns = costumerLedgerColumns()
	useEffect(() => {
		dispatch(setHeading('Customer Ledger'))
		return () => {
			dispatch(clearHeading())
		}
	}, [dispatch])

	useEffect(() => {
		setLoading(true)
		;(async () => {
			try {
				const { payload } = await dispatch(getCustomerLedger())
				setCustomers(payload.customers)
				setCustomerLedger(
					payload.customerLedger.filter(
						cus => cus.customer_id === selectedCustomer
					)
				)
				setFilteredData(
					payload.customerLedger.filter(
						cus => cus.customer_id === selectedCustomer
					)
				)
				setLoading(false)
			} catch (error) {
				console.error(error)
			}
		})()
	}, [selectedCustomer])

	const onChangeDate = date => {
		const start = stripTime(date.selection.startDate)
		const end = stripTime(date.selection.endDate)

		setStartDate(start)
		setEndDate(end)

		const filtered = customerLedger.filter(cust => {
			const custDate = stripTime(new Date(cust['created_at']))
			return custDate >= start && custDate <= end
		})

		setFilteredData(filtered)
	}
	const selectionRange = {
		startDate: startDate,
		endDate: endDate,
		key: 'selection',
	}

	return (
		<div className='w-full relative'>
			<div
				className={`absolute rounded-lg shadow-lg overflow-hidden left-2 ${
					isShow ? 'top-10' : '-top-[500px]'
				}  shadow-black duration-300`}
			>
				<DateRangePicker ranges={[selectionRange]} onChange={onChangeDate} />
			</div>
			<div className='flex w-full justify-between relative p-1  rounded'>
				{customers[0] && (
					<div>
						<label htmlFor='vendor' className='capitalize'>
							Customer name :{' '}
						</label>
						<select
							name='vender'
							onChange={e => setSelectedCustomer(e.target.value)}
							id='vendor'
							className='outline-none rounded shadow p-1'
							value={selectedCustomer}
						>
							<option value='Nil'> please select a Company Name</option>
							{customers.map(vend => (
								<option value={vend.id} key={vend.id}>
									{vend.company_name }
								</option>
							))}
						</select>
					</div>
				)}
				<button
					onClick={() => setIsShow(!isShow)}
					className='shadow p-2 capitalize hover:shadow-black rounded duration-300'
				>
					{isShow ? 'close' : 'filter by date'}
				</button>
			</div>
			{loading ? (
				<div className='p-10'>Loading......</div>
			) : (
				<DataTable
					data={filteredData}
					columns={columns}
					title={'Customer ledger'}
				/>
			)}
		</div>
	)
}

export default CostomerLedger

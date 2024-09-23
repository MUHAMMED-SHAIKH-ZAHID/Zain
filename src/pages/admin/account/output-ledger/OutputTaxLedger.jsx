import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getOutputTaxLedger } from '../../../../redux/features/ledgerSlice'
import DataTable from '../../../../components/table/DataTable'
import { DateRangePicker } from 'react-date-range'
import {
	clearHeading,
	setHeading,
} from '../../../../redux/features/HeadingSlice'
import outputTaxColumns from '../../../../components/table/columns/ledger-columns/outputTaxColumns'

const stripTime = date => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// import........................................................................................

function OutputTaxLedger() {
	const [loading, setLoading] = useState(false)
	const [outputTax, setOutputTax] = useState([])
	const [customers, setCustomers] = useState([])
	const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.id)
	const [filteredData, setFilteredData] = useState(outputTax)
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [isShow, setIsShow] = useState(false)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setHeading('Output Tax Ledger'))
		return () => {
			dispatch(clearHeading())
		}
	}, [dispatch])

	useEffect(() => {
		setLoading(true)
		;(async () => {
			try {
				const { payload } = await dispatch(getOutputTaxLedger())
				setCustomers(payload.customers)
				setOutputTax(
					payload.outputTax
				)
				setFilteredData(
					payload.outputTax.filter(tax => tax.customer_id === selectedCustomer)
				)
				setLoading(false)
			} catch (error) {
				console.error(error)
			}
		})()
	}, [selectedCustomer])
	const columns = outputTaxColumns()

	const onChangeDate = date => {
		const start = stripTime(date.selection.startDate)
		const end = stripTime(date.selection.endDate)

		setStartDate(start)
		setEndDate(end)

		const filtered = outputTax.filter(tax => {
			const taxDate = stripTime(new Date(tax['created_at']))
			return taxDate >= start && taxDate <= end
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
			<div className='flex w-full justify-end relative p-1  rounded'>
			
				<button
					onClick={() => setIsShow(!isShow)}
					className='shadow p-2 capitalize hover:shadow-black rounded duration-300'
				>
					{isShow ? 'close' : 'filter by date'}
				</button>
			</div>
			{loading ? (
				<div className='p-10'>Loading...</div>
			) : (
				<DataTable data={outputTax} columns={columns} title={'Output Tax'} />
			)}
		</div>
	)
}

export default OutputTaxLedger

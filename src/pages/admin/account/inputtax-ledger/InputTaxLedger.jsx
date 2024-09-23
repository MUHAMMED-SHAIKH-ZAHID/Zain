import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getInputTaxLedger } from '../../../../redux/features/ledgerSlice'
import DataTable from '../../../../components/table/DataTable'
import { DateRangePicker } from 'react-date-range'
import {
	clearHeading,
	setHeading,
} from '../../../../redux/features/HeadingSlice'
import InputTaxColumns from '../../../../components/table/columns/ledger-columns/InputTaxColumns'

const stripTime = date => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// import........................................................................................

function InputTaxLedger() {
	const [inputTax, setInputTax] = useState([])
	const [vendors, setVendors] = useState([])
	const [filteredData, setFilteredData] = useState(inputTax)
	const [selectedVendor, setSelectedVendor] = useState(vendors[0]?.id)
	const [loading, setLoading] = useState(true)
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [isShow, setIsShow] = useState(false)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setHeading('Input Tax Ledger'))
		return () => {
			dispatch(clearHeading())
		}
	}, [dispatch])
	useEffect(() => {
		setLoading(true)
		;(async () => {
			try {
				const { payload } = await dispatch(getInputTaxLedger())
				setVendors(payload.vendors)
				setInputTax(
					payload.inputTax
				)
				setFilteredData(
					payload.inputTax.filter(tax => selectedVendor === tax.supplier_id)
				)
				setLoading(false)
			} catch (error) {
				console.error(error)
			}
		})()
	}, [selectedVendor])

	const columns = InputTaxColumns()

	const onChangeDate = date => {
		const start = stripTime(date.selection.startDate)
		const end = stripTime(date.selection.endDate)

		setStartDate(start)
		setEndDate(end)

		const filtered = inputTax.filter(tax => {
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
				<div className='p-10'>Loading......</div>
			) : (
				<DataTable data={inputTax} columns={columns} title={'Input Tax'} />
			)}
		</div>
	)
}

export default InputTaxLedger

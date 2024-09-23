import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { getSalesLedger } from '../../../../redux/features/ledgerSlice'
import salesLedgerColumns from '../../../../components/table/columns/ledger-columns/SalesColumns'
import DataTable from '../../../../components/table/DataTable'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css'
import {
	clearHeading,
	setHeading,
} from '../../../../redux/features/HeadingSlice'

// Utility function to strip time part from date
const stripTime = date => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function SalesLedger() {
	const [startDate, setStartDate] = useState(stripTime(new Date()))
	const [endDate, setEndDate] = useState(stripTime(new Date()))
	const [sales, setSales] = useState([])
	const [filteredSales, setFilteredSales] = useState([])
	const [isShow, setIsShow] = useState(false)
	const dispatch = useDispatch()
	const datePickerRef = useRef()

	useEffect(() => {
		dispatch(setHeading('Sales Ledger'))
		return () => {
			dispatch(clearHeading())
		}
	}, [dispatch])

	useEffect(() => {
		;(async () => {
			try {
				const { payload } = await dispatch(getSalesLedger())
				setSales(payload.sales)
				setFilteredSales(payload.sales) // Initially, filtered sales should be the same as all sales
			} catch (error) {
				console.error(error)
			}
		})()
	}, [dispatch])

	const columns = salesLedgerColumns()

	const onChangeDate = date => {
		const start = stripTime(date.selection.startDate)
		const end = stripTime(date.selection.endDate)

		setStartDate(start)
		setEndDate(end)

		const filtered = sales.filter(sale => {
			const saleDate = stripTime(new Date(sale['created_at']))
			return saleDate >= start && saleDate <= end
		})

		setFilteredSales(filtered)
	}

	const handleClickOutside = event => {
		if (
			datePickerRef.current &&
			!datePickerRef.current.contains(event.target)
		) {
			setIsShow(false)
		}
	}

	useEffect(() => {
		if (isShow) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isShow])

	const selectionRange = {
		startDate: startDate,
		endDate: endDate,
		key: 'selection',
	}

	return (
		<div className='w-full relative'>
			<div
				ref={datePickerRef}
				className={`absolute rounded-lg shadow-lg overflow-hidden left-2 ${
					isShow ? 'top-10' : '-top-[500px]'
				} shadow-black duration-300`}
			>
				<DateRangePicker ranges={[selectionRange]} onChange={onChangeDate} />
			</div>
			<div className='flex w-full justify-end relative p-1 rounded'>
				<button
					onClick={() => setIsShow(!isShow)}
					className='shadow p-2 capitalize hover:shadow-black rounded duration-300'
				>
					{isShow ? 'close' : 'filter by date'}
				</button>
			</div>
			<DataTable
				data={filteredSales}
				columns={columns}
				title={'Sales Ledger'}
				total='0'
			/>
		</div>
	)
}

export default SalesLedger

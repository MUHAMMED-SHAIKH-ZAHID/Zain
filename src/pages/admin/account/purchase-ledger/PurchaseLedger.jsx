import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { getPurchaseLedger } from '../../../../redux/features/ledgerSlice'
import DataTable from '../../../../components/table/DataTable'
import purchaseLedgerColumns from '../../../../components/table/columns/ledger-columns/PurchaseColumns'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import {
	clearHeading,
	setHeading,
} from '../../../../redux/features/HeadingSlice'

// Utility function to strip time part from date
const stripTime = date => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function PurchaseLedger() {
	const [startDate, setStartDate] = useState(stripTime(new Date()))
	const [endDate, setEndDate] = useState(stripTime(new Date()))
	const [purchases, setPurchases] = useState([])
	const [filteredPurchases, setFilteredPurchases] = useState([])
	const [isShow, setIsShow] = useState(false)
	const dispatch = useDispatch()
	const datePickerRef = useRef()

	useEffect(() => {
		dispatch(setHeading('Purchase Ledger'))
		return () => {
			dispatch(clearHeading())
		}
	}, [dispatch])

	useEffect(() => {
		;(async () => {
			try {
				const { payload } = await dispatch(getPurchaseLedger())
				setPurchases(payload.purchases)
				setFilteredPurchases(payload.purchases) // Initially, filtered purchases should be the same as all purchases
			} catch (error) {
				console.error(error)
			}
		})()
	}, [dispatch])

	const columns = purchaseLedgerColumns()

	const onChangeDate = date => {
		const start = stripTime(date.selection.startDate)
		const end = stripTime(date.selection.endDate)

		setStartDate(start)
		setEndDate(end)

		const filtered = vender.filter(purchase => {
			const purchaseDate = stripTime(new Date(purchase['created_at']))
			return purchaseDate >= start && purchaseDate <= end
		})

		setFilteredPurchases(filtered)
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
				data={filteredPurchases}
				columns={columns}
				title={'Purchase Ledger'}
				total='0'
			/>
		</div>
	)
}

export default PurchaseLedger

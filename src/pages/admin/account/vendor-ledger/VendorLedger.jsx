import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getVendorLedger } from '../../../../redux/features/ledgerSlice'
import DataTable from '../../../../components/table/DataTable'
import VendorLedgerColumns from '../../../../components/table/columns/ledger-columns/VendorColumn'
import { DateRangePicker } from 'react-date-range'
import {
	clearHeading,
	setHeading,
} from '../../../../redux/features/HeadingSlice'

// import........................................................................................
const stripTime = date => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function VendorLedger() {
	const [vendors, setVendors] = useState([])
	const [loading, setLoading] = useState(false)
	const [vendorLedger, setVendorLedger] = useState([])
	const [selectedVendor, setSelectedVendor] = useState(vendors[0]?.id)
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [fitleredData, setFitleredData] = useState(vendorLedger)
	const [isShow, setIsShow] = useState(false)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setHeading('Vendor Ledger'))
		return () => {
			dispatch(clearHeading())
		}
	}, [dispatch])

	useEffect(() => {
		setLoading(true)
		;(async () => {
			try {
				const { payload } = await dispatch(getVendorLedger())
				setVendors(payload.vendors)
				setVendorLedger(
					payload.vendorLedger.filter(
						vend => vend.supplier_id === selectedVendor
					)
				)
				setFitleredData(
					payload.vendorLedger.filter(
						vend => vend.supplier_id === selectedVendor
					)
				)
				setLoading(false)
			} catch (error) {
				console.error(error)
			}
		})()
	}, [selectedVendor])

	const columns = VendorLedgerColumns()

	const onChangeDate = date => {
		const start = stripTime(date.selection.startDate)
		const end = stripTime(date.selection.endDate)

		setStartDate(start)
		setEndDate(end)

		const filtered = vendorLedger.filter(data => {
			const exactDate = stripTime(new Date(data['created_at']))
			return exactDate >= start && exactDate <= end
		})

		setFitleredData(filtered)
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
				{vendors[0] && (
					<div>
						<label htmlFor='vendor' className='capitalize'>
							vendor name :{' '}
						</label>
						<select
							name='vender'
							onChange={e => setSelectedVendor(e.target.value)}
							id='vendor'
							className='outline-none rounded shadow p-1'
							value={selectedVendor}
						>
							<option value='Nil'>--please select a vendor</option>
							{vendors.map(vend => (
								<option value={vend.id} key={vend.id}>
									{vend.first_name}
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
				<DataTable data={fitleredData} columns={columns} title={'Sales'} />
			)}
		</div>
	)
}

export default VendorLedger

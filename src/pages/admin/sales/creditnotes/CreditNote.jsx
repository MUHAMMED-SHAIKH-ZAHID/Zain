import React, { useEffect } from 'react'
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';
import { fetchCreditNotes } from '../../../../redux/features/CreditNoteSlice';
import DebitNoteColumns from '../../../../components/table/columns/DebitNoteColumns';
import DataTable from '../../../../components/table/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import CreditNoteColumns from '../../../../components/table/columns/CreditNoteColumns';
import { viewPurchaseData } from '../../../../redux/features/PurchaseSlice';
import { useNavigate } from 'react-router-dom';


const Creditnote = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(setHeading("Credit Note"));
        return () => {
          dispatch(clearHeading());
        };
      }, [dispatch]);
      useEffect(() => {
        // Dispatch the action to fetch dashboard data when the component mounts
        dispatch(fetchCreditNotes());
      }, [dispatch]);
      const { creditNotes, loading , error } = useSelector((state) => state?.creditNotes);
      const viewClickHandler = (id) => {
        dispatch(viewPurchaseData(id))
        navigate('/creditnote/view')
      }
      const columns =  CreditNoteColumns(viewClickHandler)
  return (
    <div>
           <DataTable
        data={creditNotes}
        columns={columns}
        filterColumn="payment_due_date"
        title={'creditNotes'}
        />
    </div>
  )
}

export default Creditnote
import React, { useEffect, useState } from 'react'
import { clearHeading, setHeading } from '../../../../redux/features/HeadingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDebitNotes } from '../../../../redux/features/DebitNoteSlice';
import DebitNoteColumns from '../../../../components/table/columns/DebitNoteColumns';
import DataTableExports from '../../../../components/table/DataTableExports';
import DataTable from '../../../../components/table/DataTable';
import ViewDebitNote from './ViewDebitNote';
import { viewPurchaseData } from '../../../../redux/features/PurchaseSlice';
import { useNavigate } from 'react-router-dom';

const Debitnote = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(setHeading("Debit Note"));
        return () => {
          dispatch(clearHeading());
        };
      }, [dispatch]);
      useEffect(() => {
        // Dispatch the action to fetch dashboard data when the component mounts
        dispatch(fetchDebitNotes());
      }, [dispatch]);
      const { debitNotes, loading , error } = useSelector((state) => state?.debitNotes);
     const viewClickHandler = (id) => {
    dispatch(viewPurchaseData(id))
    navigate('/debitnote/view')
  }
      const columns = DebitNoteColumns(viewClickHandler)
  return (
    <div>
           <DataTable
        data={debitNotes}
        columns={columns}
        filterColumn="grand_total"
        title={'debitNotes'}
        />
     
    </div>
  )
}

export default Debitnote
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../api/axios'
import { CustomerLedgersAPI, InputTaxLedgerAPI, OutputTaxLedgerAPI, PurchaseLedgersAPI, SalesLedgersAPI, VendorLedgersAPI } from "../../api/url";


// imports................................................................

export const getSalesLedger = createAsyncThunk(
    'admin/customerledger',
    async () => {
        try {
            const { data } = await axios.get(SalesLedgersAPI)
            return data
        } catch (error) {
            console.error(error);
        }
    }
)

export const getPurchaseLedger = createAsyncThunk(
    'admin/purchaseledger',
    async () => {
        try {
            const { data } = await axios.get(PurchaseLedgersAPI)
            return data
        } catch (error) {
            console.error(error);
        }
    }
)


export const getCustomerLedger = createAsyncThunk('admin/customersLegder', async () => {
    try {
        const { data } = await axios.get(CustomerLedgersAPI)
        return data
    } catch (error) {
    }
})


export const getVendorLedger = createAsyncThunk('admin/vendorLegder', async () => {
    try {
        const { data } = await axios.get(VendorLedgersAPI)
        return data
    } catch (error) {
    }
})


export const getInputTaxLedger = createAsyncThunk('admin/inputTaxLegder', async () => {
    try {
        const { data } = await axios.get(InputTaxLedgerAPI)
        return data
    } catch (error) {
  
    }
})


export const getOutputTaxLedger = createAsyncThunk('admin/outputTaxLegder', async () => {
    try {
        const { data } = await axios.get(OutputTaxLedgerAPI)
        return data
    } catch (error) {
        console.error(error);
    }
})


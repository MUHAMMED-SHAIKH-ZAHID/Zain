import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "../pages/admin/auth/Login"
import AdminLayout from "../layout/AdminLayout"
import Purchase from "../pages/admin/purchase/purchase/Purchase.jsx"
import Dashboard from "../pages/admin/dashboard/Dashboard"
import Customer from "../pages/admin/customer/Customer.jsx"
import Sales from "../pages/admin/sales/sales/Sales.jsx"
import DataManage from "../pages/admin/dataManage/DataManage"
import Reports from "../pages/admin/reports/Reports"
import SalesQuotation from "../pages/admin/sales/salesQuotatioin/SalesQuotation.jsx"
import SalesExecutive from "../pages/admin/salesexecutive/SalesExecutive.jsx"
import { jwtDecode } from "jwt-decode"
import ProtectedRoute from "./ProtectedRoute.jsx"
import AddPurchase from "../pages/admin/purchase/purchase/createpurchase/AddPurchase.jsx"
import EditPurchase from "../pages/admin/purchase/purchase/createpurchase/EditPurchase.jsx"
import AddSale from "../pages/admin/sales/sales/AddSale.jsx"
import PurchaseQuotation from "../pages/admin/purchase/purchasequotation/PurchaseQuotation.jsx"
import AddPurchaseQuotation from "../pages/admin/purchase/purchasequotation/AddPurchaseQuotation.jsx"
import EditPurchaseQuotation from "../pages/admin/purchase/purchasequotation/EditPurchaseQuotation.jsx"
import ViewPurchaseQuotation from "../pages/admin/purchase/purchasequotation/ViewPurchaseQuotation.jsx"
import PurchaseQuoteConvert from "../pages/admin/purchase/purchase/PurchaseQuoteConvert.jsx"
import AddSalesQuotation from "../pages/admin/sales/salesQuotatioin/AddSalesQuotation.jsx"
import EditSalesQuotation from "../pages/admin/sales/salesQuotatioin/EditSalesQuotation.jsx"
import ViewSalesQuotation from "../pages/admin/sales/salesQuotatioin/ViewSalesQuotation.jsx"
import SalesQuoteConvert from "../pages/admin/sales/sales/SalesQuoteConvert.jsx"
import EditSales from "../pages/admin/sales/sales/EditSales.jsx"
import ViewPurchase from "../pages/admin/purchase/purchase/ViewPurchase.jsx"
import ViewSales from "../pages/admin/sales/sales/ViewSales.jsx"
import ViewCustomer from "../pages/admin/customer/ViewCustomer.jsx"
import AccountComponent from "../pages/admin/account/AccountCrud/AccountComponent.jsx"
import AccountBook from "../pages/admin/account/AccountBook.jsx"
import Stock from "../pages/admin/stock/Stock.jsx"
import ViewSalesExecutive from "../pages/admin/salesexecutive/ViewSalesExecutive.jsx"
import ViewVendor from "../pages/admin/vendor/ViewVendor.jsx"
import Vendors from "../pages/admin/vendor/Vendors.jsx"
import Products from "../pages/admin/dataManage/products/ProductComponent.jsx"
import Expense from "../pages/admin/purchase/expense/Expense.jsx"
import Payment from "../pages/admin/payment/Payment.jsx"
import Debitnote from "../pages/admin/purchase/debitnotes/DebitNote.jsx"
import CreditNote from "../pages/admin/sales/creditnotes/CreditNote.jsx"
import AddDebitNote from "../pages/admin/purchase/debitnotes/AddDebitNote.jsx"
import AddCreditNote from "../pages/admin/sales/creditnotes/AddCreditNote.jsx"
import UpdateStock from "../pages/admin/stock/UpdateStock.jsx"
import ViewDebitNote from "../pages/admin/purchase/debitnotes/ViewDebitNote.jsx"
import ViewCreditNotes from "../pages/admin/sales/creditnotes/ViewCreditNotes.jsx"
import CostomerLedger from '../pages/admin/account/customer-ledger/CostomerLedger.jsx'
import SalesLedger from '../pages/admin/account/sales-ledger/SalesLedger.jsx'
import PurchaseLedger from '../pages/admin/account/purchase-ledger/PurchaseLedger.jsx'
import VendorLedger from "../pages/admin/account/vendor-ledger/VendorLedger.jsx"
import InputTaxLedger from "../pages/admin/account/inputtax-ledger/InputTaxLedger.jsx"
import OutputTaxLedger from "../pages/admin/account/output-ledger/OutputTaxLedger.jsx"


const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if(decoded.role === 'admin'){

        return <Navigate to="/" replace />;
      }
      else{
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return children; 
};

const AdminRoute = () => {
  return (
    <div>
       <Routes>
    <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>}/>

    <Route element={<ProtectedRoute requiredRole="admin" />}>
    <Route path="/" element={<AdminLayout /> }>
    <Route path="/" element={<Dashboard /> }/>
    <Route path="/vendor" element={<Vendors /> }/>
    <Route path="/vendor/view" element={<ViewVendor /> }/>
    <Route path="/purchase" element={<Purchase /> }/>
    <Route path="/purchase/create" element={<AddPurchase /> }/>
    <Route path="/purchase/edit" element={<EditPurchase /> }/>
    <Route path="/purchase/view" element={<ViewPurchase /> }/>
    <Route path="/purchase/order" element={<PurchaseQuotation /> }/>
    <Route path="/purchase/order/create" element={<AddPurchaseQuotation /> }/>
    <Route path="/purchase/order/edit" element={<EditPurchaseQuotation /> }/>
    <Route path="/purchase/order/view" element={<ViewPurchaseQuotation /> }/>
    <Route path="/purchase/order/convert" element={<PurchaseQuoteConvert /> }/>
    <Route path="/salesexecutive" element={<SalesExecutive /> }/>
    <Route path="/salesexecutive/view" element={<ViewSalesExecutive /> }/>
    <Route path="/customer" element={<Customer /> }/>
    <Route path="/customer/view" element={<ViewCustomer /> }/>
    <Route path="/invoice" element={<Sales /> }/>
    <Route path="/invoice/create" element={<AddSale /> }/>
    <Route path="/invoice/view" element={<ViewSales /> }/>
    <Route path="/invoice/edit" element={<EditSales /> }/>
    <Route path="/invoice/update" element={<AddSale /> }/>
    <Route path="/sales/order" element={<SalesQuotation /> }/>
    <Route path="/invoice/order/create" element={<AddSalesQuotation /> }/>
    <Route path="/invoice/order/edit" element={<EditSalesQuotation /> }/>
    <Route path="/invoice/order/view" element={<ViewSalesQuotation /> }/>
    <Route path="/invoice/order/convert" element={<SalesQuoteConvert /> }/>
    <Route path="/datamanage" element={<DataManage /> }/>
    <Route path="/reports" element={<Reports /> }/>
    <Route path="/account" element={<AccountComponent /> }/>
    <Route path="/account/view" element={<AccountBook /> }/>
    <Route path="/stock" element={<Stock /> }/>
    <Route path="/stock/update" element={<UpdateStock /> }/>
    <Route path="/products" element={<Products /> }/>
    <Route path="/expense" element={<Expense /> }/>
    <Route path="/payment" element={<Payment /> }/>
    <Route path="/debitnote" element={<Debitnote /> }/>
    <Route path="/debitnote/add" element={<AddDebitNote /> }/>
    <Route path="/debitnote/view" element={<ViewDebitNote /> }/>
    <Route path="/creditnote" element={<CreditNote /> }/>
    <Route path="/creditnote/add" element={<AddCreditNote /> }/>
    <Route path="/creditnote/view" element={<ViewCreditNotes /> }/>
    <Route path='/customerledger' element={<CostomerLedger />} />
    <Route path='/salesledger' element={<SalesLedger />} />
    <Route path='/supplierledger' element={<VendorLedger />} />
		<Route path='/purchaseledger' element={<PurchaseLedger />} />
		<Route path='/inputtaxledger' element={<InputTaxLedger />} />
		<Route path='/outputtaxledger' element={<OutputTaxLedger />} />
    </Route >
    </Route>
    </Routes>
    </div>
  )
}

export default AdminRoute
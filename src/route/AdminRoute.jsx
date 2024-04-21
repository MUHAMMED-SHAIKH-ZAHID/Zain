import { Route, Routes } from "react-router-dom"
import { Login } from "../pages/admin/auth/Login"
import AdminLayout from "../layout/AdminLayout"
import Purchase from "../pages/admin/purchase/Purchase"
import Dashboard from "../pages/admin/dashboard/Dashboard"
import Suppliers from "../pages/admin/supplier/Suppliers"
import Customer from "../pages/admin/customer/Customer.jsx"
import Sales from "../pages/admin/sales/Sales"
import DataManage from "../pages/admin/dataManage/DataManage"
import Reports from "../pages/admin/reports/Reports"
import Account from "../pages/admin/account/Account"
import SalesQuotation from "../pages/admin/sales/SalesQuotation.jsx"
import SalesExecutive from "../pages/admin/salesexecutive/SalesExecutive.jsx"


const AdminRoute = () => {
  return (
    <div>
       <Routes>
    <Route path="/login" element={<Login /> }/>
    <Route path="/" element={<AdminLayout /> }>
    <Route path="/" element={<Dashboard /> }/>
    <Route path="/supplier" element={<Suppliers /> }/>
    <Route path="/purchase" element={<Purchase /> }/>
    <Route path="/salesexecutive" element={<SalesExecutive /> }/>
    <Route path="/customer" element={<Customer /> }/>
    <Route path="/sales" element={<Sales /> }/>
    <Route path="/sales/quotation" element={<SalesQuotation /> }/>
    <Route path="/datamanage" element={<DataManage /> }/>
    <Route path="/reports" element={<Reports /> }/>
    <Route path="/account" element={<Account /> }/>
    </Route >
    </Routes>
    </div>
  )
}

export default AdminRoute
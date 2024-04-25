import { Navigate, Route, Routes } from "react-router-dom"
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
import SalesQuotation from "../pages/admin/sales/salesQuotatioin/SalesQuotation.jsx"
import SalesExecutive from "../pages/admin/salesexecutive/SalesExecutive.jsx"
import CreatePurchase from "../pages/admin/purchase/CreatePurchase.jsx"
import { jwtDecode } from "jwt-decode"
import ProtectedRoute from "./ProtectedRoute.jsx"
import AddPurchase from "../pages/admin/purchase/createpurchase/AddPurchase.jsx"


const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if(decoded.role === 'admin'){

        return <Navigate to="/" replace />;
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
    <Route path="/supplier" element={<Suppliers /> }/>
    <Route path="/purchase" element={<Purchase /> }/>
    <Route path="/purchase/create" element={<AddPurchase /> }/>
    <Route path="/salesexecutive" element={<SalesExecutive /> }/>
    <Route path="/customer" element={<Customer /> }/>
    <Route path="/sales" element={<Sales /> }/>
    <Route path="/sales/quotation" element={<SalesQuotation /> }/>
    <Route path="/datamanage" element={<DataManage /> }/>
    <Route path="/reports" element={<Reports /> }/>
    <Route path="/account" element={<Account /> }/>
    </Route >
    </Route>
    </Routes>
    </div>
  )
}

export default AdminRoute
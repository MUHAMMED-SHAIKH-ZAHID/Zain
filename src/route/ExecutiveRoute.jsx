import { Navigate, Route, Routes } from "react-router-dom";
import ExecutiveLayout from "../layout/ExecutiveLayout";
import ExecutiveDashboard from "../pages/executive/dashboard/ExecutiveDashboard";
import {jwtDecode} from "jwt-decode";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Customer from "../pages/executive/customer/Customer.jsx";
import SalesQuotation from "../pages/executive/salesQuotatioin/SalesQuotation.jsx";
import AddSalesQuotation from "../pages/executive/salesQuotatioin/AddSalesQuotation.jsx";
import EditSalesQuotation from "../pages/executive/salesQuotatioin/EditSalesQuotation.jsx";
import ViewSalesQuotation from "../pages/executive/salesQuotatioin/ViewSalesQuotation.jsx";
import Invoice from "../pages/executive/Invoice/Invoice.jsx";
import ViewInvoice from "../pages/executive/Invoice/ViewInvoice.jsx";
import ViewCustomer from "../pages/executive/customer/ViewCustomer.jsx";
import Stock from "../pages/executive/stock/Stock.jsx";
import Payment from "../pages/executive/payment/Payment.jsx";
import { Login } from "../pages/admin/auth/Login.jsx";

const RedirectIfAuthenticated = ({ children }) => {

  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      
      if(decoded.role === 'executive'){
        return <Navigate to="/executive/dashboard" replace />;
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
    }
  }

  return children;
};

const ExecutiveRoute = () => {

  return (
    <Routes>
        <Route path="/login" element={<RedirectIfAuthenticated ><Login /></RedirectIfAuthenticated>} />
        <Route element={<ProtectedRoute requiredRole="executive" />}>
            <Route path="/" element={<ExecutiveLayout />}>
            <Route path="/dashboard" element={<ExecutiveDashboard />} />
            {/* Add other executive routes here */}
            <Route path="/customers" element={<Customer />} />
            <Route path="/customer/view" element={<ViewCustomer />} />
            <Route path="/payment" element={<Payment /> }/>
            <Route path="/invoice/order" element={<SalesQuotation />} />
            <Route path="/invoice/order/create" element={<AddSalesQuotation />} />
            <Route path="/invoice/order/edit" element={<EditSalesQuotation />} />
            <Route path="/invoice/order/view" element={<ViewSalesQuotation />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/invoice/view" element={<ViewInvoice />} />
            <Route path="/stock" element={<Stock />} />
            </Route>
        </Route>
    </Routes>
  );
};

export default ExecutiveRoute;

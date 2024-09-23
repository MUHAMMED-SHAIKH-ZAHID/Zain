import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminRoute from "./AdminRoute";
import ExecutiveRoute from './ExecutiveRoute';

const MainRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AdminRoute />} />
        <Route path="/executive/*" element={<ExecutiveRoute />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoute;

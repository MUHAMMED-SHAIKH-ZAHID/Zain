import { Provider } from "react-redux";
import ReactDOM from 'react-dom/client'
import './index.css'
import MainRoute from './route/MainRoute.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store/store.js'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

    <MainRoute />
    </PersistGate>
    </Provider>
)

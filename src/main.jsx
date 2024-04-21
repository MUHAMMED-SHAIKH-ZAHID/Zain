import { Provider } from "react-redux";
import ReactDOM from 'react-dom/client'
import './index.css'
import MainRoute from './route/MainRoute.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <MainRoute />
    </PersistGate>
    </Provider>
)

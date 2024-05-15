import { combineReducers, configureStore } from "@reduxjs/toolkit";


import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import HeadingSlice  from "../features/HeadingSlice";
import AuthSlice from "../features/AuthSlice";
import DashboardSlice from "../features/DashboardSlice";
import SupplierSlice from "../features/SupplierSlice";
import PurchaseSlice from "../features/PurchaseSlice";
import SalesExecutiveSlice from "../features/SalesExecutiveSlice";
import CustomerSlice from "../features/CustomerSlice";
import CategorySlice from "../features/DataManageSlices/CategorySlice";
import BrandSlice from "../features/DataManageSlices/BrandSlice";
import RoutesSlice from "../features/DataManageSlices/RoutesSlice";
import ProductSlice from "../features/DataManageSlices/ProductSlice";
import LocationSlice from "../features/DataManageSlices/LocationSlice";
import SalesSlice from "../features/SalesSlice";
import PurchaseQuotationSlice from "../features/PurchaseQuotationSlice";
import SalesQuotationSlice from "../features/SalesQuotationSlice";
import TaxSlice from "../features/DataManageSlices/TaxSlice";
import AccountSlice from "../features/AccountSlice";
import StockSlice from "../features/StockSlice";


const rootReducer = combineReducers({
    heading: HeadingSlice ,
    auth:AuthSlice,
    dashboard:DashboardSlice,
    supplier:SupplierSlice,
    purchases:PurchaseSlice,
    salesExecutives:SalesExecutiveSlice,
    customers:CustomerSlice,
    categories:CategorySlice,
    routeslice:RoutesSlice,
    brands:BrandSlice,
    products:ProductSlice,
    locations:LocationSlice,
    sales:SalesSlice,
    purchaseQuotation:PurchaseQuotationSlice,
    salesQuotation:SalesQuotationSlice,
    tax:TaxSlice,
    account:AccountSlice,
    stock:StockSlice,

});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);

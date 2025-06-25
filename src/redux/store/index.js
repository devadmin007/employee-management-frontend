import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

import rootReducer from "@/redux/reducer";
const persistConfig = {
  key: "root",
  storage,
};

const combinedReducer = combineReducers(rootReducer);

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  reducer: persistedReducer,
  //     middleware: getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: ["REGISTER"],
  //       ignoredPaths: ["register"],
  //     },
  //   }),
});

export const persistor = persistStore(store);

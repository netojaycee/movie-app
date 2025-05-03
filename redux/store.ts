import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { api } from "./appData";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Fix for Expo
import userReducer from "./slices/userSlice";

// Persist configuration for the user slice
const userPersistConfig = {
  key: "root",
  storage: AsyncStorage,

};


// Create persisted reducers
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
// Create the persistor
export const persistor = persistStore(store);

// Enable listeners for RTK Query
setupListeners(store.dispatch);

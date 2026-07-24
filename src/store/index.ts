import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import { appApi } from './apiSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

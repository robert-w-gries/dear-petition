import { configureStore } from '@reduxjs/toolkit';
import { api } from '~/src/service/api';
import authReducer from '~/src/slices/auth';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export default store;

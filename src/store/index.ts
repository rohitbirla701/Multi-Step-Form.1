import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authSlice } from './slices/authSlice';
import { featureFlagsSlice } from './slices/featureFlagsSlice';
import { uiSlice } from './slices/uiSlice';
import { apiSlice } from './api/apiSlice';
import formReducer, {
  set_form_data,
  next_step,
  prev_step,
  reset_form,
  update_form_field,
  upload_profile_pic
} from './slices/formSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    featureFlags: featureFlagsSlice.reducer,
    ui: uiSlice.reducer,
    api: apiSlice.reducer,
    form: formReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { login, logout, setUser, setTokens, clearAuth } = authSlice.actions;
export const { toggleFeatureFlag, setFeatureFlags } = featureFlagsSlice.actions;
export const { setLoading, setError, clearError, setNotification, clearNotification } = uiSlice.actions;

export {
  set_form_data,
  next_step,
  prev_step,
  reset_form,
  update_form_field,
  upload_profile_pic
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { store } from '@/store';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/common/Toaster';
import '@/utils/i18n';
import '@/styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <App />
            <Toaster />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
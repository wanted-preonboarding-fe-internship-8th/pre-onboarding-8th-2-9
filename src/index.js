import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import GlobalStyle from './assets/styles/global';
import Layout from './components/Layout';
import router from './router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </React.StrictMode>
);

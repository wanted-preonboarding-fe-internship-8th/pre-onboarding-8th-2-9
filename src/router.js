import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import IssueList from './pages/IssueList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IssueList />,
  },
]);

export default router;

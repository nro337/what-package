import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import ErrorPage from './error-page.tsx'

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { HomeComponentWrapper } from './HomeComponentWrapper.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element:  <HomeComponentWrapper />,
    errorElement: <ErrorPage />,
  }
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

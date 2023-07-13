import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CssBaseline from '@mui/material/CssBaseline'
import Dashboard from './pages/Dashboard'
import Menu from './components/menu/Menu'

function App() {
  const Layout = () => {
    return (
      <div className="h-full bg-primary text-foreground">
        <div className="flex font-inter bg-primary">
          <div className="bg-secondary w-48 h-screen">
            <Menu />
          </div>
          <div className="w-full">
            <div className="bg-secondary h-16">
              <a>teste</a>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/dashboard', element: <Dashboard /> },
      ],
    },
    {
      path: '/Login',
      element: <LoginPage />,
    },
  ])

  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App

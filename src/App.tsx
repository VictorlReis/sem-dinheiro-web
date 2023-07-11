import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { createTheme, ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import Dashboard from './pages/Dashboard'

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <Outlet />
        </div>
        <Footer />
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
    <ThemeProvider theme={darkTheme}>
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
    </ThemeProvider>
  )
}

export default App

<<<<<<< HEAD
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import CustomersPage from './pages/CustomersPage'
import CalendarPage from './pages/CalendarPage'
import DashboardDetailsPage from './pages/DashboardDetailsPage'
import MailPage from './pages/MailPage'
import ChatPage from './pages/ChatPage'
import TaskBoardPage from './pages/TaskBoardPage'
import './Dashboard.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/e-commerce/orders" element={<OrdersPage />} />
        <Route path="/e-commerce/customers" element={<CustomersPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/mail" element={<MailPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/tasks" element={<TaskBoardPage />} />
        <Route path="/task" element={<TaskBoardPage />} />
        <Route path="/task-board" element={<TaskBoardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/cards" element={<DashboardDetailsPage type="card" />} />
        <Route path="/dashboard/contacts/:contactId" element={<DashboardDetailsPage type="contact" />} />
        <Route path="/dashboard/profile" element={<DashboardDetailsPage type="profile" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
=======
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<Outlet />} />
          <Route path="/customers" element={<Outlet />} />
        </Route>
>>>>>>> b18446ea2676e7e2063df67152d1fca58cd239f1
      </Routes>
    </BrowserRouter>
  )
}
<<<<<<< HEAD
=======

export default App
>>>>>>> b18446ea2676e7e2063df67152d1fca58cd239f1

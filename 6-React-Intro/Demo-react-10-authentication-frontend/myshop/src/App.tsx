import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from 'react-bootstrap/Container'
import HomePage from './home/HomePage'
import ItemListPage from './items/ItemListPage'
import ItemCreatePage from './items/ItemCreatePage'
import ItemUpdatePage from './items/ItemUpdatePage'
import NavMenu from './shared/NavMenu'
import LoginPage from './auth/LoginPage'
import RegisterPage from './auth/RegisterPage'
import ProtectedRoute from './auth/ProtectedRoute'
import { AuthProvider } from './auth/AuthContext'
import './App.css'

const queryClient = new QueryClient() // creates the single instance

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Container className="mt-4">
            <NavMenu />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/items" element={<ItemListPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/itemcreate" element={<ItemCreatePage />} />
                <Route path="/itemupdate/:itemId" element={<ItemUpdatePage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}
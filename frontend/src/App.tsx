import { Routes, Route } from "react-router-dom"
import Login from "@/page/Login"

// Admin Path Routes
import AdminDashboard from "@/page/admin/Dashboard"

// Guru Path Routes
import GuruDashboard from "@/page/guru/Dashboard"

// Siswa Path Routes
import SiswaDashboard from "@/page/siswa/Dashboard"
import DataSiswa from "@/page/siswa/Datadiri"

// BK Path Routes
import BKDasboard from "@/page/bk/Dashboard"

// Protected Route
import ProtectedRoute from "@/utils/ProtectedRoute"

// Not Found Page
import NotFoundPage from "@/page/404NotFound"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Admin Path Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>} 
      />

      {/* Guru Path Routes */}
      <Route path="/guru/dashboard" element={
        <ProtectedRoute roles={["guru"]}>
          <GuruDashboard />
        </ProtectedRoute>} 
      />

      {/* Siswa Path Routes */}
      <Route path="/bk/dashboard" element={
        <ProtectedRoute roles={["bk"]}>
          <BKDasboard />
        </ProtectedRoute>} 
      />

      {/* Siswa Path Routes */}
      <Route path="/siswa/dashboard" element={
        <ProtectedRoute roles={["siswa"]}>
          <SiswaDashboard />
        </ProtectedRoute>}
      />
      <Route path="/siswa/datadiri" element={
        <ProtectedRoute roles={["siswa"]}>
          <DataSiswa />
        </ProtectedRoute>}
      />

      {/* Not Found Page */}
      <Route path="/404" 
        element={<NotFoundPage />} 
      />
    </Routes>
  )
}

export default App

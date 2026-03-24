import { Routes, Route } from "react-router-dom"
import Login from "@/page/Login"

// Admin Path Routes
import AdminDashboard from "@/page/admin/Dashboard"
import AdminPelanggaran from "@/page/admin/Pelanggaran"
import AdminSiswa from "@/page/admin/Siswa"
import AdminJenisPelanggaran from "@/page/admin/JenisPelanggaran"
import AdminGuru from "@/page/admin/Guru"
import AdminKelas from "@/page/admin/Kelas"
import AdminCetakSurat from "@/page/admin/CetakSurat"

// Guru Path Routes
import GuruDashboard from "@/page/guru/Dashboard"

// Siswa Path Routes
import SiswaDashboard from "@/page/siswa/Dashboard"
import DataSiswa from "@/page/siswa/Datadiri"

// BK Path Routes
// import BKDasboard from "@/page/bk/Dashboard"

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
        <ProtectedRoute roles={["admin", "kepala sekolah", "wakasek"]}>
          <AdminDashboard />
        </ProtectedRoute>}
      />
      <Route path="/admin/pelanggaran" element={
        <ProtectedRoute roles={["admin", "wakasek", "kepala sekolah"]}>
          <AdminPelanggaran />
        </ProtectedRoute>}
      />
      <Route path="/admin/siswa" element={
        <ProtectedRoute roles={["admin", "wakasek", "kepala sekolah"]}>
          <AdminSiswa />
        </ProtectedRoute>}
      />
      <Route path="/admin/jenis-pelanggaran" element={
        <ProtectedRoute roles={["admin", "wakasek", "kepala sekolah"]}>
          <AdminJenisPelanggaran />
        </ProtectedRoute>}
      />
      <Route path="/admin/guru" element={
        <ProtectedRoute roles={["admin", "wakasek", "kepala sekolah"]}>
          <AdminGuru />
        </ProtectedRoute>}
      />
      <Route path="/admin/kelas" element={
        <ProtectedRoute roles={["admin", "wakasek", "kepala sekolah"]}>
          <AdminKelas />
        </ProtectedRoute>}
      />
      <Route path="/admin/cetak-surat" element={
        <ProtectedRoute roles={["admin", "wakasek", "kepala sekolah"]}>
          <AdminCetakSurat />
        </ProtectedRoute>}
      />

      {/* Guru Path Routes */}
      <Route path="/guru/dashboard" element={
        <ProtectedRoute roles={["guru mapel"]}>
          <GuruDashboard />
        </ProtectedRoute>}
      />

      {/* BK Path Routes */}
      {/* <Route path="/bk/dashboard" element={
        <ProtectedRoute roles={["bk"]}>
          <BKDasboard />
        </ProtectedRoute>}
      /> */}

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

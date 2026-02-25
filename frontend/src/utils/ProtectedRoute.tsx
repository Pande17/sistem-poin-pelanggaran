import { Navigate } from "react-router-dom"
import type { JSX } from "react"

interface ProtectedRouteProps {
  children: JSX.Element
  roles?: string[]
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token")
  const userRaw = localStorage.getItem("user")

  if (!token || !userRaw) {
    return <Navigate to="/" replace />
  }

  const user = JSON.parse(userRaw)

  // proteksi role (opsional)
  if (roles && !roles.includes(user.role?.toLowerCase())) {
    return <Navigate to="/404" replace />
  }

  return children
}

export default ProtectedRoute

import { useAuth } from "@/contexts/AuthContext"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  element: React.ReactNode
  allowedRoles?: ("staff" | "admin")[]
}

export default function ProtectedRoute({ element, allowedRoles = ["staff", "admin"] }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null; // or a loading spinner component if you have one
  }

  if (!user) {
    return <Navigate to="/staff/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If not authorized, redirect to the home page
    return <Navigate to="/" replace />
  }

  return <>{element}</>
}

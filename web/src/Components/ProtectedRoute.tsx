import { ReactNode } from "react"
import { useAuth } from "../Context/AuthContext"
import { useNavigate } from "react-router";


function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const authContext = useAuth()
  if (!authContext || !authContext.user) {
    navigate("/")
    return null
  }

  return children;
}

export default ProtectedRoute
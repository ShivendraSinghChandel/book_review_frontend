import { Navigate } from "react-router-dom"
import axios from "axios"
import { BASE_URL } from "../utils/Config"
import { useState, useEffect } from "react"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token")
  const [verified, setVerified] = useState(null)
  const [userRole, setUserRole] = useState(null)

  if (!token) return <Navigate to="/login" replace />

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(`${BASE_URL}user/verify`, { token })
        if (res.status === 200) {
          const role = res.data.data.role
          setUserRole(role)
          setVerified(allowedRoles.includes(role))
        } else {
          localStorage.removeItem("token")
          setVerified(false)
        }
      } catch {
        localStorage.removeItem("token")
        setVerified(false)
      }
    }
    verify()
  }, [allowedRoles])

  if (verified === null) return <div>Loading...</div>

  if (verified === false) {
    if (userRole === "admin") return <Navigate to="/admin" replace />
    if (userRole === "user") return <Navigate to="/" replace />
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
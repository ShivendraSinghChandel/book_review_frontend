import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/Config";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  if(!email || !password){
    alert("Provide all values")
    return
  }

  try {
    const response = await axios.post(`${BASE_URL}user/login`, { role, email, password })
    if(response.status === 200){
      const token = response.data.token
      const userRole = response.data.role
      localStorage.setItem("token", token)

      if(userRole === "admin") navigate("/admin")
      else if(userRole === "user") navigate("/")
      else alert("Unknown role")
    } else {
      alert("Login failed")
    }
  } catch(err) {
    console.error(err)
    alert("Login failed")
  }
}


  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-center max-w-80">
        <div className="flex w-full mb-6 border overflow-hidden">
          <button
            className={`w-1/2 p-2 ${role === "user" ? "bg-black text-white" : ""}`}
            onClick={() => setRole("user")}
          >
            User
          </button>
          <button
            className={`w-1/2 p-2 ${role === "admin" ? "bg-black text-white" : ""}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>
        <h2 className="text-2xl text-center mb-6">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-4"
        />
        <input
          type="password" name="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-6"
        />
        <input
          type="submit" value="Login" onClick={handleLogin}
          className="w-full border-2"
        />
        {
        role === "user" && 
        <p> dont have an account. <Link to="/register" className="text-blue cursor-pointer">Register</Link> </p>
      }
      </div>
      
    </div>
  );
};

export default Login;

import { Navigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/Config";
import { useState,useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    if(!token) return <Navigate to="/login" />;

    const [verified, setVerified] = useState(null);

    useEffect(()=>{
        const verify = async ()=>{
            try{
                const res = await axios.post(`${BASE_URL}user/verify`, { token });
                if(res.status === 200){
                    if(allowedRoles.includes(res.data.data.role)){
                        setVerified(true);
                    } else {
                        localStorage.removeItem("token");
                        window.location.href="/login";
                    }
                } else {
                    localStorage.removeItem("token");
                    window.location.href="/login";
                }
            } catch(err){
                localStorage.removeItem("token");
                window.location.href="/login";
            }
        }
        verify();
    },[])

    if(verified===null) return <div>Loading...</div>;
    return children;
}

export default ProtectedRoute;

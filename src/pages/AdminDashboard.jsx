import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [active, setActive] = useState("view");
    const navigate = useNavigate();

    const handleMenu = (menu) => {
        setActive(menu);
        if(menu === "create") navigate("/admin/create-book");
        else if(menu === "view") navigate("/admin/view-books");
    }

    const handlelogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };


    return(
        <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl mb-6">Admin Dashboard</h2>

            <div className="flex gap-4 mb-6">
                
                <button 
                    onClick={()=>handleMenu("view")}
                    className={`border px-4 py-2 ${active==="view" ? "bg-gray-200" : ""}`}
                >View Books</button>
                 <button 
                    onClick={()=>handleMenu("create")}
                    className={`border px-4 py-2 ${active==="create" ? "bg-gray-200" : ""}`}
                >Create Book</button>
                <button 
                    onClick={handlelogout}
                    className={`border px-4 py-2`}
                >Log out</button>
            </div>

            <div className="w-full max-w-5xl border p-4">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminDashboard;

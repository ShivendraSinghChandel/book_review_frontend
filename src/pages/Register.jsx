import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/Config";
import { Link, useNavigate } from "react-router-dom";

const Register = () =>{
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const handleRegister = async () => {
    if (!username || !email || !password) {
        alert("provide all values");
        return;
    }
    try {
        const response = await axios.post(`${BASE_URL}user/register`, {
            username,
            email,
            password
        });

        if (response?.status === 200) {
            localStorage.setItem("token", response.data.token);
            navigate("/");
        }
        else{
            alert(response?.data?.message)
        }
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Registration failed");
    }
};

    return(
        <>
        <div className="flex h-screen w-full items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center max-w-80"> 
                <h2 className="text-2xl text-center mb-6">Register</h2>
                <input 
                    type="text" name="username" placeholder="Enter Username" onChange={(e) =>{setUsername(e.target.value)}}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="email" name="email" placeholder="Enter email" onChange={(e) =>{setEmail(e.target.value)}}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="text" name="password" placeholder="Enter password" onChange={(e) =>{setPassword(e.target.value)}}
                    className="w-full border p-2 mb-6"
                />
                <input 
                    type="submit" value="Submit" onClick={handleRegister} 
                    className="w-full border-2"
                />

                <p> Already have a account. <Link to="/login"> Login </Link> </p>
        </div>
        </div>
        </>
    )
}

export default  Register;

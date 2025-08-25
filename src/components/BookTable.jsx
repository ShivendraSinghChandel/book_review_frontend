import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/Config";
import * as jwtDecode from "jwt-decode";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

const BookTable = () => {
    const [books,setBooks] = useState([]);
    const [userRole,setUserRole] = useState(null);
    const [search,setSearch] = useState("");
    const [pageCount,setPageCount] = useState(0);
    const [currentPage,setCurrentPage] = useState(0);
    const limit = 10;
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            const decoded = jwtDecode.jwtDecode(token);
            setUserRole(decoded.role)
        }
        else{
            setUserRole(null)
        }
        fetchBooks()
    },[])

    useEffect(()=>{
        fetchBooks()
    },[currentPage,search])

    const fetchBooks = async ()=>{
        try{
            const response = await axios.get(`${BASE_URL}book/getall`, {
              params: {
                limit,
                skip: currentPage * limit,
                search
              }
            });
            if(response.status === 200){
                setBooks(response.data.data)
                setPageCount(Math.ceil((response.data.total||response.data.data.length)/limit))
            }
        }catch(err){console.log(err)}
    }

    const handleDelete = async(id)=>{
        if(!window.confirm("Are you sure?"))return;
        try{
            const res = await axios.delete(`${BASE_URL}book/deletebook/${id}`)
            if(res.status === 200){
                alert("Deleted")
                fetchBooks()
            }
        }catch(err){console.log(err)}
    }

    const handleUpdate=(id)=>{
        navigate(`/admin/update-book/${id}`)
    }

    const handleShowDetails=(id)=>{
        navigate(`/book/${id}`)
    }

    const handlePageClick=(data)=>{
        setCurrentPage(data.selected)
    }

    const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null); 
    navigate("/login", { replace: true });

  };

    return(
        <div className="p-4">
            {userRole === "user" && (
                <div className="flex justify-end mb-2">
                    <button className="border-2 p-2" onClick={handleLogout}>
                    Logout
                    </button>
                </div>
            )}
            <h2 className="text-2xl text-center mb-4">Books</h2>
            <div className="mb-4 flex justify-center gap-2">
                <input type="text" placeholder="Search title or author" value={search} onChange={e=>setSearch(e.target.value)} className="border p-2 w-80"/>
                <button onClick={()=>{
                    setCurrentPage(0);
                    fetchBooks();
                }} className="border px-3">Search</button>
            </div>
            <table className="border w-full text-left">
                <thead>
                    <tr className="border">
                        <th className="border px-2">Title</th>
                        <th className="border px-2">Author</th>
                        <th className="border px-2">Genre</th>
                        <th className="border px-2">Published</th>
                        <th className="border px-2">Available</th>
                        <th className="border px-2">Avg Rating</th>
                        <th className="border px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((b,i)=>{
                        return(
                            <tr key={b._id} className="border">
                                <td className="border px-2">{b.title}</td>
                                <td className="border px-2">{b.author}</td>
                                <td className="border px-2">{b.genre}</td>
                                <td className="border px-2">{b.published_year ? new Date(b.published_year).toISOString().split('T')[0] : ''}</td>
                                <td className="border px-2">{b.available_copies}</td>
                                <td className="border px-2">{b.average_rating||0}</td>
                                <td className="border px-2 flex gap-1 flex-wrap">
                                    <button onClick={()=>handleShowDetails(b._id)} className="border px-2 py-1">Show</button>
                                    {userRole==="admin" && <>
                                        <button onClick={()=>handleUpdate(b._id)} className="border px-2 py-1">Update</button>
                                        <button onClick={()=>handleDelete(b._id)} className="border px-2 py-1">Delete</button>
                                    </>}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="mt-4 flex justify-center">
                <ReactPaginate 
                    previousLabel={"<"}
                    nextLabel={">"}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"flex gap-2"}
                    pageClassName={"border px-3 py-1"}
                    previousClassName={"border px-3 py-1"}
                    nextClassName={"border px-3 py-1"}
                    activeClassName={"bg-black text-white"}
                />
            </div>
        </div>
    )
}

export default BookTable;

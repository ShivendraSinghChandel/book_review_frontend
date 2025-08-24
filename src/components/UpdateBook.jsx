import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/Config";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [publishedYear, setPublishedYear] = useState("");
    const [availableCopies, setAvailableCopies] = useState("");

    useEffect(() => {
        fetchBook();
    }, []);

    const fetchBook = async () => {
        try {
            const response = await axios.get(`${BASE_URL}book/getsingle/${id}`);
            if (response.status === 200 && response.data.data.book) {
                const book = response.data.data.book;
                setTitle(book.title);
                setAuthor(book.author);
                setGenre(book.genre);
                setPublishedYear(book.published_year);
                setAvailableCopies(book.available_copies);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleUpdateBook = async () => {
        if(!title || !author || !genre || !publishedYear || !availableCopies){
            alert("Provide all values");
            return;
        }
        try {
            const response = await axios.put(`${BASE_URL}book/update`, {
                id,
                title,
                author,
                genre,
                published_year: publishedYear,
                available_copies: availableCopies
            });

            if(response.data.success){
                alert("Book updated successfully");
                navigate("/admin/view-books"); 
            } else {
                alert("Failed to update book");
            }
        } catch(err){
            console.error(err);
            alert("Error occurred while updating book");
        }
    }

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center max-w-80"> 
                <h2 className="text-2xl text-center mb-6">Update Book</h2>

                <input 
                    type="text" placeholder="Enter Title" value={title} onChange={(e)=>setTitle(e.target.value)}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="text" placeholder="Enter Author" value={author} onChange={(e)=>setAuthor(e.target.value)}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="text" placeholder="Enter Genre" value={genre} onChange={(e)=>setGenre(e.target.value)}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="date" placeholder="Enter Published Year" value={publishedYear ? new Date(publishedYear).toISOString().split('T')[0] : ''} onChange={(e)=>setPublishedYear(e.target.value)}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="number" placeholder="Enter Available Copies" value={availableCopies} onChange={(e)=>setAvailableCopies(e.target.value)}
                    className="w-full border p-2 mb-6"
                />

                <input 
                    type="submit" value="Update Book" onClick={handleUpdateBook} 
                    className="w-full border-2"
                />
            </div>
        </div>
    )
}

export default UpdateBook;

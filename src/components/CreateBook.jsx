import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/Config";

const CreateBook = () =>{
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [publishedYear, setPublishedYear] = useState("");
    const [availableCopies, setAvailableCopies] = useState("");

    const handleCreateBook = async () => {
        if(!title || !author || !genre || !publishedYear || !availableCopies){
            alert("Provide all values");
            return;
        }

        try{
            const response = await axios.post(`${BASE_URL}book/create`, {
                title,
                author,
                genre,
                published_year: publishedYear,
                available_copies: availableCopies
            });

            if(response.data.success){
                alert("Book created successfully");
                setTitle(""); setAuthor(""); setGenre(""); setPublishedYear(""); setAvailableCopies("");
            } else {
                alert("Failed to create book");
            }
        }
        catch(err){
            console.error(err);
            alert("Error occurred while creating book");
        }
    }

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center max-w-80"> 
                <h2 className="text-2xl text-center mb-6">Create Book</h2>

                <input 
                    type="text" placeholder="Enter Title" onChange={(e)=>setTitle(e.target.value)}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="text" placeholder="Enter Author" onChange={(e)=>setAuthor(e.target.value)}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="text" placeholder="Enter Genre" onChange={(e)=>setGenre(e.target.value)}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="date" placeholder="Enter Published Year" onChange={(e)=>setPublishedYear(e.target.value)}
                    className="w-full border p-2 mb-4"
                />
                <input 
                    type="number" placeholder="Enter Available Copies" onChange={(e)=>setAvailableCopies(e.target.value)}
                    className="w-full border p-2 mb-6"
                />

                <input 
                    type="submit" value="Create Book" onClick={handleCreateBook} 
                    className="w-full border-2"
                />
            </div>
        </div>
    )
}

export default CreateBook;

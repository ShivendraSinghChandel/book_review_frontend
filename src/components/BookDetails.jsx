import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/Config";

const BookDetails = () => {
  const { id } = useParams();

  const [book, setBook] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [yourFeedbacks, setYourFeedbacks] = useState([]);

  const [token] = useState(localStorage.getItem("token") || "");

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editContext, setEditContext] = useState("");

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const fetchBookDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}book/getsingle/${id}`);
      if (res.status === 200) {
        setBook(res.data.data.book || {});
        setFeedbacks(res.data.data.feedbacks || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchYourFeedbacks = async () => {
    if (!token) return;
    try {
      const res = await axios.post(`${BASE_URL}feedback/get_user_feedback`, {
        token,
        book_id: id,
      });
      if (res.status === 200) {
        setYourFeedbacks(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookDetails();
    fetchYourFeedbacks();
  }, []);

  const handleAddFeedback = async () => {
    if (!rating || !comment) {
      alert("Provide rating and comment");
      return;
    }

    if (Number(rating) <= 0 || Number(rating) > 5 ) {
        alert("rating must be 1 to 5");
        return
    }
    try {
      await axios.post(`${BASE_URL}feedback/create`, {
        token,
        book_id: id,
        rating,
        comment,
      });
      setRating("");
      setComment("");
      fetchBookDetails();
      fetchYourFeedbacks();
    } catch (err) {
      console.error(err);
      alert("Error adding feedback");
    }
  };

  const handleEditClick = (fb, ctx) => {
    setEditingId(fb._id);
    setEditRating(fb.rating);
    setEditComment(fb.comment);
    setEditContext(ctx);
  };

  const handleUpdateFeedback = async (fbId) => {
    try {
      await axios.put(`${BASE_URL}feedback/update`, {
        id: fbId,
        rating: editRating,
        comment: editComment,
        book_id:id
      });
      setEditingId(null);
      setEditRating("");
      setEditComment("");
      setEditContext("");
      fetchBookDetails();
      fetchYourFeedbacks();
    } catch (err) {
      console.error(err);
      alert("Error updating feedback");
    }
  };

  const handleDeleteFeedback = async (fbId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}feedback/delete/${fbId}/${id}`);
      if (res.status === 200) {
        fetchBookDetails();
        fetchYourFeedbacks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const decodeUserId = () => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  const userId = decodeUserId();

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl mb-6">{book.title || "Book Details"}</h2>

      <div className="border p-4 w-96 mb-6">
        <p><b>Author:</b> {book.author}</p>
        <p><b>Genre:</b> {book.genre}</p>
        <p><b>Published:</b> {book.published_year ? new Date(book.published_year).toISOString().split('T')[0] : ''}</p>
        <p><b>Available Copies:</b> {book.available_copies}</p>
        <p><b>Average Rating:</b> {book.average_rating || 0}</p>
      </div>

      <div className="flex gap-6 w-full max-w-3xl mb-6 flex-wrap">
        <div className="border p-4 w-80">
          <h3 className="mb-2 text-lg">Write Feedback</h3>
          <input
            type="number"
            placeholder="Rating 1-5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border w-full p-2 mb-2"
          />
          <textarea
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border w-full p-2 mb-2"
          />
          <button onClick={handleAddFeedback} className="border px-3 py-1 w-full">
            Submit
          </button>
        </div>
      </div>

      {yourFeedbacks.length > 0 && (
        <div className="w-full max-w-3xl mb-4">
          <h3 className="text-lg mb-2">Your Feedbacks</h3>
          {yourFeedbacks.map((fb, index) => (
            <div key={index} className="border p-3 mb-2">
              {editingId === fb._id && editContext === "your" ? (
                <div>
                  <input
                    type="number"
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                    className="border w-full p-1 mb-1"
                  />
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="border w-full p-1 mb-1"
                  />
                  <button
                    onClick={() => handleUpdateFeedback(fb._id)}
                    className="border px-2 py-1 mr-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContext("");
                    }}
                    className="border px-2 py-1"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <p><b>Rating:</b> {fb.rating}</p>
                  <p><b>Comment:</b> {fb.comment}</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleEditClick(fb, "your")}
                      className="border px-2 py-1"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(fb._id)}
                      className="border px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-3xl">
        <h3 className="mb-2 text-lg">All Feedbacks</h3>
        {feedbacks.map((fb, index) => {
          const isUser = fb.user_id._id === userId;
          return (
            <div key={index} className="border p-3 mb-2">
              <p><b>Name:</b> {fb.user_id.username}</p>
              {editingId === fb._id && editContext === "all" ? (
                <div>
                  <input
                    type="number"
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                    className="border w-full p-1 mb-1"
                  />
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="border w-full p-1 mb-1"
                  />
                  <button
                    onClick={() => handleUpdateFeedback(fb._id)}
                    className="border px-2 py-1 mr-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContext("");
                    }}
                    className="border px-2 py-1"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <p><b>Rating:</b> {fb.rating}</p>
                  <p><b>Comment:</b> {fb.comment}</p>
                  {isUser && (
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleEditClick(fb, "all")}
                        className="border px-2 py-1"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteFeedback(fb._id)}
                        className="border px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookDetails;

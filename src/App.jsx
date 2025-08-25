import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateBook from "./components/CreateBook";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookTable from "./components/BookTable";
import UpdateBook from "./components/UpdateBook";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import BookDetails from "./components/BookDetails";

const App = () =>{

  const token = localStorage.getItem("token");

  return(
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

        <Route path="/" element={
            <ProtectedRoute allowedRoles={["user"]}>
                <BookTable />
            </ProtectedRoute>
        } />

        <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
            </ProtectedRoute>
        }>
          <Route index element={<BookTable/>}/>
            <Route path="create-book" element={<CreateBook />} />
            <Route path="update-book/:id" element={<UpdateBook />} />
            <Route path="view-books" element={<BookTable />} />
        </Route>

        <Route path="/book/:id" element={
            <ProtectedRoute allowedRoles={["admin","user"]}>
                <BookDetails />
            </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;

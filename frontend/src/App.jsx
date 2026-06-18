import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookForm from './pages/BookForm';
import Members from './pages/Members';
import MemberForm from './pages/MemberForm';
import Borrowings from './pages/Borrowings';
import BorrowBook from './pages/BorrowBook';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/books" element={
              <PrivateRoute><Books /></PrivateRoute>
            } />
            <Route path="/books/add" element={
              <PrivateRoute adminOnly={true}><BookForm /></PrivateRoute>
            } />
            <Route path="/books/edit/:id" element={
              <PrivateRoute adminOnly={true}><BookForm /></PrivateRoute>
            } />
            <Route path="/members" element={
              <PrivateRoute adminOnly={true}><Members /></PrivateRoute>
            } />
            <Route path="/members/add" element={
              <PrivateRoute adminOnly={true}><MemberForm /></PrivateRoute>
            } />
            <Route path="/members/edit/:id" element={
              <PrivateRoute adminOnly={true}><MemberForm /></PrivateRoute>
            } />
            <Route path="/borrowings" element={
              <PrivateRoute adminOnly={true}><Borrowings /></PrivateRoute>
            } />
            <Route path="/borrowings/borrow" element={
              <PrivateRoute adminOnly={true}><BorrowBook /></PrivateRoute>
            } />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
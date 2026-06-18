import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/books?search=${search}&page=${page}`);
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`/books/${id}`);
      toast.success('Book deleted');
      fetchBooks();
    } catch (err) {
      toast.error('Failed to delete book');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📖 Books</h2>
        {user?.role === 'admin' && (
          <Link to="/books/add" className="btn btn-dark">+ Add Book</Link>
        )}
      </div>
      <form className="d-flex mb-4 gap-2" onSubmit={handleSearch}>
        <input type="text" className="form-control" placeholder="Search by title, author or category..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-outline-dark" type="submit">Search</button>
      </form>

      {loading ? (
        <div className="text-center mt-5"><div className="spinner-border" /></div>
      ) : (
        <>
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Available</th>
                <th>Total</th>
                {user?.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr><td colSpan="7" className="text-center">No books found</td></tr>
              ) : (
                books.map((b, i) => (
                  <tr key={b._id} className={b.availableCopies === 0 ? 'table-danger' : ''}>
                    <td>{(page - 1) * 6 + i + 1}</td>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.category}</td>
                    <td>
                      {b.availableCopies}
                      {b.availableCopies === 0 && <span className="badge bg-danger ms-2">Unavailable</span>}
                    </td>
                    <td>{b.totalCopies}</td>
                    {user?.role === 'admin' && (
                      <td>
                        <Link to={`/books/edit/${b._id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b._id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-outline-dark btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span className="align-self-center">Page {page} of {totalPages}</span>
            <button className="btn btn-outline-dark btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Books;
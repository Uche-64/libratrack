import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const Borrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBorrowings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/borrowings?status=${filter}&page=${page}`);
      setBorrowings(data.borrowings);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to load borrowings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBorrowings(); }, [page, filter]);

  const handleReturn = async (id) => {
    if (!window.confirm('Confirm book return?')) return;
    try {
      await axios.put(`/borrowings/return/${id}`);
      toast.success('Book returned successfully!');
      fetchBorrowings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return book');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🔄 Borrowings</h2>
        <Link to="/borrowings/borrow" className="btn btn-dark">+ Issue Book</Link>
      </div>

      <div className="mb-4 d-flex gap-2">
        {['', 'borrowed', 'overdue', 'returned'].map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            className={`btn btn-sm ${filter === s ? 'btn-dark' : 'btn-outline-dark'}`}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center mt-5"><div className="spinner-border" /></div>
      ) : (
        <>
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Book</th>
                <th>Member</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.length === 0 ? (
                <tr><td colSpan="8" className="text-center">No borrowings found</td></tr>
              ) : (
                borrowings.map((b, i) => (
                  <tr key={b._id} className={b.status === 'overdue' ? 'table-danger' : ''}>
                    <td>{(page - 1) * 8 + i + 1}</td>
                    <td>{b.book?.title}</td>
                    <td>{b.member?.name}</td>
                    <td>{new Date(b.borrowDate).toLocaleDateString()}</td>
                    <td>{new Date(b.dueDate).toLocaleDateString()}</td>
                    <td>{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`badge ${b.status === 'returned' ? 'bg-success' : b.status === 'overdue' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status !== 'returned' && (
                        <button className="btn btn-sm btn-success" onClick={() => handleReturn(b._id)}>
                          Return
                        </button>
                      )}
                    </td>
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

export default Borrowings;
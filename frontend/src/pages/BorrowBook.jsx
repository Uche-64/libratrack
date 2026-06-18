import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const BorrowBook = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ bookId: '', memberId: '' });
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, membersRes] = await Promise.all([
          axios.get('/books?page=1'),
          axios.get('/members?page=1')
        ]);
        setBooks(booksRes.data.books);
        setMembers(membersRes.data.members);
      } catch (err) {
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'bookId') setSelectedBook(books.find(b => b._id === value));
    if (name === 'memberId') setSelectedMember(members.find(m => m._id === value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/borrowings/borrow', form);
      toast.success('Book issued successfully! Due in 14 days.');
      navigate('/borrowings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        <div className="card shadow p-4">
          <h3 className="mb-4">📤 Issue a Book</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Select Book</label>
              <select name="bookId" className="form-select"
                value={form.bookId} onChange={handleChange} required>
                <option value="">-- Select a Book --</option>
                {books.map(b => (
                  <option key={b._id} value={b._id} disabled={b.availableCopies === 0}>
                    {b.title} — {b.author} ({b.availableCopies} available)
                  </option>
                ))}
              </select>
              {selectedBook && (
                <div className="alert alert-info mt-2 py-2 small">
                  <strong>Category:</strong> {selectedBook.category} &nbsp;|&nbsp;
                  <strong>ISBN:</strong> {selectedBook.ISBN} &nbsp;|&nbsp;
                  <strong>Available:</strong> {selectedBook.availableCopies}/{selectedBook.totalCopies}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Select Member</label>
              <select name="memberId" className="form-select"
                value={form.memberId} onChange={handleChange} required>
                <option value="">-- Select a Member --</option>
                {members.map(m => (
                  <option key={m._id} value={m._id} disabled={m.status === 'suspended'}>
                    {m.name} — {m.membershipID} {m.status === 'suspended' ? '(Suspended)' : ''}
                  </option>
                ))}
              </select>
              {selectedMember && (
                <div className="alert alert-info mt-2 py-2 small">
                  <strong>Email:</strong> {selectedMember.email} &nbsp;|&nbsp;
                  <strong>Status:</strong> {selectedMember.status}
                </div>
              )}
            </div>

            <div className="alert alert-secondary py-2">
              <strong>📅 Borrow Date:</strong> {new Date().toLocaleDateString()} &nbsp;|&nbsp;
              <strong>Due Date:</strong> {dueDate.toLocaleDateString()} (14 days)
            </div>

            <button className="btn btn-dark w-100" disabled={loading}>
              {loading ? 'Issuing...' : 'Issue Book'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BorrowBook;
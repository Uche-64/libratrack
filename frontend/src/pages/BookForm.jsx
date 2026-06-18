import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const BookForm = () => {
  const [form, setForm] = useState({
    title: '', author: '', ISBN: '', category: '',
    totalCopies: '', description: '', publishedYear: ''
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/books/${id}`).then(({ data }) => setForm({
        title: data.title,
        author: data.author,
        ISBN: data.ISBN,
        category: data.category,
        totalCopies: data.totalCopies,
        description: data.description || '',
        publishedYear: data.publishedYear || ''
      }));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/books/${id}`, form);
        toast.success('Book updated!');
      } else {
        await axios.post('/books', form);
        toast.success('Book added!');
      }
      navigate('/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        <div className="card shadow p-4">
          <h3 className="mb-4">{isEdit ? '✏️ Edit Book' : '➕ Add Book'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input type="text" name="title" className="form-control"
                  value={form.title} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Author</label>
                <input type="text" name="author" className="form-control"
                  value={form.author} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">ISBN</label>
                <input type="text" name="ISBN" className="form-control"
                  value={form.ISBN} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <input type="text" name="category" className="form-control"
                  placeholder="e.g. Fiction, Science, History"
                  value={form.category} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Total Copies</label>
                <input type="number" name="totalCopies" className="form-control"
                  value={form.totalCopies} onChange={handleChange} required min="1" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Published Year</label>
                <input type="number" name="publishedYear" className="form-control"
                  value={form.publishedYear} onChange={handleChange} min="1000" max="2026" />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" rows="3"
                  value={form.description} onChange={handleChange} />
              </div>
            </div>
            <button className="btn btn-dark w-100" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
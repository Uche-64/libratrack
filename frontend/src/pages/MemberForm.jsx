import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const MemberForm = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', membershipID: '', address: '', status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/members/${id}`).then(({ data }) => setForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        membershipID: data.membershipID,
        address: data.address || '',
        status: data.status
      }));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/members/${id}`, form);
        toast.success('Member updated!');
      } else {
        await axios.post('/members', form);
        toast.success('Member registered!');
      }
      navigate('/members');
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
          <h3 className="mb-4">{isEdit ? '✏️ Edit Member' : '➕ Register Member'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control"
                  value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input type="text" name="phone" className="form-control"
                  value={form.phone} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Membership ID</label>
                <input type="text" name="membershipID" className="form-control"
                  placeholder="e.g. LIB-2024-001"
                  value={form.membershipID} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Address</label>
                <input type="text" name="address" className="form-control"
                  value={form.address} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <select name="status" className="form-select"
                  value={form.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <button className="btn btn-dark w-100" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Member' : 'Register Member'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
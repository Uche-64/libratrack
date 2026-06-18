import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/register', form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-icon">🏛️</div>
          <h2>Join LibraTrack</h2>
          <p>Create your account to access the community library system and start exploring our collection.</p>
          <div className="mt-4 text-start w-100" style={{maxWidth:'220px'}}>
            <div className="mb-3 p-3 rounded" style={{background:'rgba(255,255,255,0.1)'}}>
              <div style={{color:'var(--gold)', fontWeight:700}}>👤 Member</div>
              <div style={{color:'#cdd5e0', fontSize:'0.85rem'}}>Browse and view books</div>
            </div>
            <div className="p-3 rounded" style={{background:'rgba(255,255,255,0.1)'}}>
              <div style={{color:'var(--gold)', fontWeight:700}}>🔑 Admin</div>
              <div style={{color:'#cdd5e0', fontSize:'0.85rem'}}>Full system management</div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <h3>Create Account</h3>
          <p style={{color:'var(--muted)', marginBottom:'1.5rem'}}>Fill in your details to get started</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control search-bar"
                placeholder="Enter your full name"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control search-bar"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control search-bar"
                placeholder="Create a password"
                value={form.password} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Account Role</label>
              <select name="role" className="form-select search-bar"
                value={form.role} onChange={handleChange}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn btn-navy w-100 py-2" disabled={loading}>
              {loading ? '⏳ Creating account...' : '✅ Create Account'}
            </button>
          </form>
          <hr className="my-3" />
          <p className="text-center mb-0" style={{fontSize:'0.9rem'}}>
            Already have an account? <Link to="/login" style={{color:'var(--gold)', fontWeight:600}}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
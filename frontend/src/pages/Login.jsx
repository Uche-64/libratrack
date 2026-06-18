import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', form);
      login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-icon">📚</div>
          <h2>LibraTrack</h2>
          <p>Your modern community library management system. Track books, members, and borrowings with ease.</p>
          <div className="mt-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span>✅</span><span style={{color:'#cdd5e0', fontSize:'0.9rem'}}>Role-based access control</span>
            </div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span>✅</span><span style={{color:'#cdd5e0', fontSize:'0.9rem'}}>Real-time stock tracking</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span>✅</span><span style={{color:'#cdd5e0', fontSize:'0.9rem'}}>Overdue alerts & history</span>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <h3>Welcome Back</h3>
          <p style={{color:'var(--muted)', marginBottom:'1.5rem'}}>Sign in to your LibraTrack account</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control search-bar"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control search-bar"
                placeholder="Enter your password"
                value={form.password} onChange={handleChange} required />
            </div>
            <button className="btn btn-navy w-100 py-2" disabled={loading}>
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>
          <hr className="my-3" />
          <p className="text-center mb-0" style={{fontSize:'0.9rem'}}>
            Don't have an account? <Link to="/register" style={{color:'var(--gold)', fontWeight:600}}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
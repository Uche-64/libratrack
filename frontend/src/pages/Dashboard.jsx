import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalBooks: 0, totalMembers: 0, activeBorrowings: 0, overdueBorrowings: 0 });
  const [recentBorrowings, setRecentBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user.role === 'admin') {
          const [booksRes, membersRes, borrowingsRes] = await Promise.all([
            axios.get('/books?page=1'),
            axios.get('/members?page=1'),
            axios.get('/borrowings?page=1')
          ]);
          const allBorrowings = borrowingsRes.data.borrowings;
          setStats({
            totalBooks: booksRes.data.totalPages * 6,
            totalMembers: membersRes.data.totalPages * 6,
            activeBorrowings: allBorrowings.filter(b => b.status === 'borrowed').length,
            overdueBorrowings: allBorrowings.filter(b => b.status === 'overdue').length
          });
          setRecentBorrowings(allBorrowings.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" style={{color:'var(--navy)'}} /></div>;

  return (
    <div>
      <div className="page-header">
        <h2>👋 Welcome, {user?.name}</h2>
        <span className="badge" style={{background:'var(--gold)', color:'var(--navy)', fontSize:'0.85rem', padding:'0.5rem 1rem'}}>
          {user?.role?.toUpperCase()}
        </span>
      </div>

      {user.role === 'admin' && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-3 col-6">
              <div className="stat-card stat-card-blue">
                <h6>📖 Total Books</h6>
                <h2>{stats.totalBooks}</h2>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card stat-card-green">
                <h6>👥 Total Members</h6>
                <h2>{stats.totalMembers}</h2>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card stat-card-gold">
                <h6>🔄 Active Loans</h6>
                <h2>{stats.activeBorrowings}</h2>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card stat-card-red">
                <h6>⚠️ Overdue</h6>
                <h2>{stats.overdueBorrowings}</h2>
              </div>
            </div>
          </div>

          <div className="lib-card card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>📋 Recent Borrowings</span>
              <Link to="/borrowings" style={{color:'var(--gold)', textDecoration:'none', fontSize:'0.9rem'}}>View All →</Link>
            </div>
            <div className="card-body p-0">
              <table className="table table-custom mb-0">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBorrowings.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">No borrowings yet</td></tr>
                  ) : (
                    recentBorrowings.map(b => (
                      <tr key={b._id}>
                        <td><strong>{b.book?.title}</strong></td>
                        <td>{b.member?.name}</td>
                        <td>{new Date(b.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge badge-${b.status}`}>{b.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {user.role === 'member' && (
        <div className="lib-card card p-4 text-center">
          <div style={{fontSize:'4rem'}}>📚</div>
          <h4 style={{color:'var(--navy)'}}>Explore Our Collection</h4>
          <p className="text-muted">Browse available books in the library.</p>
          <Link to="/books" className="btn btn-navy px-4">Browse Books</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
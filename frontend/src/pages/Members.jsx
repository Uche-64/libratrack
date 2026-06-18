import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/members?search=${search}&page=${page}`);
      setMembers(data.members);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await axios.delete(`/members/${id}`);
      toast.success('Member deleted');
      fetchMembers();
    } catch (err) {
      toast.error('Failed to delete member');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Members</h2>
        <Link to="/members/add" className="btn btn-dark">+ Add Member</Link>
      </div>
      <form className="d-flex mb-4 gap-2" onSubmit={handleSearch}>
        <input type="text" className="form-control" placeholder="Search by name, email or membership ID..."
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
                <th>Name</th>
                <th>Membership ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr><td colSpan="7" className="text-center">No members found</td></tr>
              ) : (
                members.map((m, i) => (
                  <tr key={m._id}>
                    <td>{(page - 1) * 6 + i + 1}</td>
                    <td>{m.name}</td>
                    <td>{m.membershipID}</td>
                    <td>{m.email}</td>
                    <td>{m.phone}</td>
                    <td>
                      <span className={`badge ${m.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/members/edit/${m._id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m._id)}>Delete</button>
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

export default Members;
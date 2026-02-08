import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await api.get('/api/v1/links');
      setLinks(response.data);
    } catch (err) {
      console.error('Failed to fetch links:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/v1/links', { original_url: url });
      setUrl('');
      fetchLinks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (link) => {
    const newUrl = prompt('Enter new URL:', link.original_url);
    if (!newUrl || newUrl === link.original_url) return;
    try {
      await api.patch(`/api/v1/links/${link.id}`, { original_url: newUrl });
      fetchLinks();
    } catch {
      alert('Failed to update link');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this link?')) return;
    try {
      await api.delete(`/api/v1/links/${id}`);
      fetchLinks();
    } catch {
      alert('Failed to delete link');
    }
  };

  const copyToClipboard = (code) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const shortUrl = `${apiUrl}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    alert('Copied to clipboard!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/top" style={{ marginRight: '15px', color: '#1a1a1a' }}>Top 100</Link>
          <Link to="/profile" style={{ marginRight: '15px', color: '#1a1a1a' }}>Profile</Link>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="url"
            placeholder="Enter URL to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#1a1a1a', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
            {loading ? 'Creating...' : 'Shorten'}
          </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Original URL</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Short Code</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Clicks</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => (
            <tr key={link.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>
                <a href={link.original_url} target="_blank" rel="noopener noreferrer">
                  {link.original_url.substring(0, 55)}
                  {link.original_url.length > 55 && '...'}
                </a>
              </td>
              <td style={{ padding: '10px' }}>
                <code>{link.short_code}</code>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{link.click_count}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button onClick={() => copyToClipboard(link.short_code)} title="Copy short URL" aria-label="Copy short URL" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>
                  📋
                </button>
                <button onClick={() => handleEdit(link)} title="Edit URL" aria-label="Edit URL" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>
                  ✏️
                </button>
                <button onClick={() => navigate(`/links/${link.id}`)} title="View details" aria-label="View details" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>
                  📊
                </button>
                <button onClick={() => handleDelete(link.id)} title="Delete link" aria-label="Delete link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {links.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
          No links yet. Create your first short link above!
        </p>
      )}
    </div>
  );
}

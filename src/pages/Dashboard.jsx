import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      await api.post('/api/v1/links', { url });
      setUrl('');
      fetchLinks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this link?')) return;
    try {
      await api.delete(`/api/v1/links/${id}`);
      fetchLinks();
    } catch (err) {
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
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2>Dashboard</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
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
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
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
                  {link.original_url.substring(0, 50)}
                  {link.original_url.length > 50 && '...'}
                </a>
              </td>
              <td style={{ padding: '10px' }}>
                <code>{link.short_code}</code>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{link.click_count}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button onClick={() => copyToClipboard(link.short_code)} style={{ marginRight: '5px' }}>
                  Copy
                </button>
                <button onClick={() => navigate(`/links/${link.id}`)}>
                  Details
                </button>
                <button onClick={() => handleDelete(link.id)} style={{ marginLeft: '5px', color: 'red' }}>
                  Delete
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

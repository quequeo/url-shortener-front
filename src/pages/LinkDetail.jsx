import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LinkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linkRes, visitsRes] = await Promise.all([
          api.get(`/api/v1/links/${id}`),
          api.get(`/api/v1/links/${id}/visits`)
        ]);
        setLink(linkRes.data);
        setVisits(visitsRes.data);
      } catch (err) {
        setError('Failed to load link details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const copyToClipboard = () => {
    const shortUrl = `http://localhost:3000/${link.short_code}`;
    navigator.clipboard.writeText(shortUrl);
    alert('Copied to clipboard!');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  if (!link) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      <h2>Link Details</h2>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <strong>Original URL:</strong>
          <br />
          <a href={link.original_url} target="_blank" rel="noopener noreferrer">
            {link.original_url}
          </a>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>Short URL:</strong>
          <br />
          <code style={{ background: 'white', padding: '5px 10px', borderRadius: '4px' }}>
            http://localhost:3000/{link.short_code}
          </code>
          <button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
            Copy
          </button>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>Total Clicks:</strong> {link.click_count}
        </div>

        <div>
          <strong>Created:</strong> {new Date(link.created_at).toLocaleString()}
        </div>
      </div>

      <h3>Recent Visits ({visits.length})</h3>

      {visits.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', marginTop: '30px' }}>
          No visits yet. Share your link to start tracking!
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>IP Address</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>User Agent</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Visited At</th>
            </tr>
          </thead>
          <tbody>
            {visits.map(visit => (
              <tr key={visit.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>
                  <code>{visit.ip_address}</code>
                </td>
                <td style={{ padding: '10px', fontSize: '12px', maxWidth: '300px' }}>
                  {visit.user_agent.substring(0, 80)}
                  {visit.user_agent.length > 80 && '...'}
                </td>
                <td style={{ padding: '10px' }}>
                  {new Date(visit.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

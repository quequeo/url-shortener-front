import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LinkDetail() {
  const [link, setLink] = useState(null);
  const [visits, setVisits] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const [linkRes, visitsRes] = await Promise.all([
          api.get(`/api/v1/links/${id}`),
          api.get(`/api/v1/links/${id}/visits`)
        ]);
        setLink(linkRes.data);
        setVisits(visitsRes.data);
      } catch (err) {
        console.error('Failed to fetch link data:', err);
        navigate('/dashboard');
      }
    };

    fetchLinkData();
  }, [id, navigate]);

  if (!link) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      <h2>Link Details</h2>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <p><strong>Original URL:</strong> <a href={link.original_url} target="_blank" rel="noopener noreferrer">{link.original_url}</a></p>
        <p><strong>Short Code:</strong> <code>{link.short_code}</code></p>
        <p><strong>Total Clicks:</strong> {link.click_count}</p>
        <p><strong>Created:</strong> {new Date(link.created_at).toLocaleString()}</p>
      </div>

      <h3>Recent Visits ({visits.length})</h3>
      
      {visits.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>IP Address</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>User Agent</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {visits.map(visit => (
              <tr key={visit.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{visit.ip_address}</td>
                <td style={{ padding: '10px' }}>
                  {visit.user_agent?.substring(0, 50) || 'N/A'}
                  {visit.user_agent?.length > 50 && '...'}
                </td>
                <td style={{ padding: '10px' }}>{new Date(visit.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#999' }}>No visits yet</p>
      )}
    </div>
  );
}

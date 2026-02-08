import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Top() {
  const [links, setLinks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/api/v1/top').then(res => setLinks(res.data));
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Top 100 URLs</h2>
        <Link to={user ? '/dashboard' : '/login'} style={{ color: '#1a1a1a' }}>
          {user ? 'Dashboard' : 'Login'}
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'center', width: '50px' }}>#</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>URL</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Short Code</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, index) => (
            <tr key={link.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', textAlign: 'center', color: '#999' }}>{index + 1}</td>
              <td style={{ padding: '10px' }}>
                <a href={link.original_url} target="_blank" rel="noopener noreferrer">
                  {link.original_url.substring(0, 60)}
                  {link.original_url.length > 60 && '...'}
                </a>
              </td>
              <td style={{ padding: '10px' }}><code>{link.short_code}</code></td>
              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>{link.click_count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {links.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>No links yet.</p>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import '../components/ui/Table.css';

export default function Top() {
  const [links, setLinks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/api/v1/top').then(res => setLinks(res.data));
  }, []);

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Top 100 URLs</h2>
          {!user && (
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
              Login to create links
            </Link>
          )}
        </div>

        <div className="card">
          <div className="table-container" style={{ borderRadius: 'var(--radius-lg)', border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                  <th style={{ width: '50%' }}>Original URL</th>
                  <th style={{ width: '30%' }}>Short Code</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Clicks</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, index) => (
                  <tr key={link.id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td>
                      <div style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--primary)' }}>
                        <a href={link.original_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                          {link.original_url}
                        </a>
                      </div>
                    </td>
                    <td>
                      <code>{link.short_code}</code>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{link.click_count}</td>
                  </tr>
                ))}
                {links.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No links yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

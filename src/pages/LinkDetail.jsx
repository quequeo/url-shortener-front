import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import '../components/ui/Table.css';
import { Copy, ArrowLeft, ExternalLink, Calendar, MousePointer, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

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
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const shortUrl = `${apiUrl}/${link.short_code}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner"></div> {/* Add spinner css if needed or just Text */}
        Loading...
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div style={{ textAlign: 'center', color: 'var(--error)', padding: '2rem' }}>
        {error}
      </div>
    </Layout>
  );

  if (!link) return null;

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} style={{ paddingLeft: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Link Details</h2>
        </div>

        <Card>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 40%', minWidth: '300px' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={14} /> Original URL
              </h3>
              <a href={link.original_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', wordBreak: 'break-all', color: 'var(--primary)', fontWeight: 500, fontSize: '1.1rem' }}>
                {link.original_url}
              </a>
            </div>

            <div style={{ flex: '0 0 auto', minWidth: '100px' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ExternalLink size={14} /> Short URL
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <code style={{ fontSize: '1rem', padding: '0.5rem 0.75rem', background: 'var(--bg-body)', border: '1px solid var(--border)' }}>
                  {link.short_code}
                </code>
                <Button size="sm" variant="outline" onClick={copyToClipboard} title="Copy">
                  <Copy size={14} />
                </Button>
              </div>
            </div>

            <div style={{ flex: '0 0 auto', minWidth: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MousePointer size={14} /> Total Clicks
              </h3>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{link.click_count}</span>
            </div>

            <div style={{ flex: '0 0 auto', minWidth: '150px' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={14} /> Created
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500, fontSize: '1rem' }}>
                  {new Date(link.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(link.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {link.devices && link.devices.length > 0 && (
          <div className="card">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 className="card-title" style={{ margin: 0 }}>Devices</h3>
            </div>
            <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Browser</th>
                    <th style={{ textAlign: 'center' }}>Visits</th>
                    <th style={{ textAlign: 'right' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {link.devices.map(device => (
                    <tr key={device.browser}>
                      <td>{device.browser}</td>
                      <td style={{ textAlign: 'center' }}>{device.count}</td>
                      <td style={{ textAlign: 'right' }}>{device.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Recent Visits ({visits.length})</h3>
          </div>

          <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
            {visits.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No visits yet. Share your link to start tracking!
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>IP Address</th>
                    <th>User Agent</th>
                    <th>Visited At</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map(visit => (
                    <tr key={visit.id}>
                      <td>
                        <code>{visit.ip_address}</code>
                      </td>
                      <td>
                        <div style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={visit.user_agent}>
                          {visit.user_agent}
                        </div>
                      </td>
                      <td>
                        {new Date(visit.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import '../components/ui/Table.css';
import '../components/ui/Table.css';
import { Copy, Edit2, BarChart2, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const { user } = useAuth();
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
      toast.success('Link created successfully!');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (link) => {
    setSelectedLink(link);
    setEditUrl(link.original_url);
    setIsEditModalOpen(true);
  };

  const handleUpdateLink = async () => {
    if (!editUrl || editUrl === selectedLink.original_url) {
      setIsEditModalOpen(false);
      return;
    }

    try {
      await api.patch(`/api/v1/links/${selectedLink.id}`, { original_url: editUrl });
      fetchLinks();
      toast.success('Link updated successfully');
      setIsEditModalOpen(false);
    } catch {
      toast.error('Failed to update link');
    }
  };

  const openDeleteModal = (link) => {
    setSelectedLink(link);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteLink = async () => {
    try {
      await api.delete(`/api/v1/links/${selectedLink.id}`);
      fetchLinks();
      toast.success('Link deleted successfully');
      setIsDeleteModalOpen(false);
    } catch {
      toast.error('Failed to delete link');
    }
  };

  const copyToClipboard = (code) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const shortUrl = `${apiUrl}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Dashboard</h2>
        </div>

        <Card title="New Short Link">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="https://example.com/long-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                type="url"
              />
            </div>
            <Button type="submit" isLoading={loading}>
              Shorten URL
            </Button>
          </form>
          {error && <p style={{ color: 'var(--error)', marginTop: '0.5rem', fontSize: '0.875rem' }}>{error}</p>}
        </Card>

        <div className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Your Links</h3>
          </div>

          <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '55%' }}>Original URL</th>
                  <th style={{ width: '20%' }}>Short Code</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Clicks</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map(link => (
                  <tr key={link.id}>
                    <td>
                      <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ExternalLink size={14} style={{ flexShrink: 0 }} />
                        <a href={link.original_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                          {link.original_url}
                        </a>
                      </div>
                    </td>
                    <td>
                      <code>{link.short_code}</code>
                    </td>
                    <td style={{ textAlign: 'center' }}>{link.click_count}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn" onClick={() => copyToClipboard(link.short_code)} title="Copy Short URL">
                          <Copy size={16} />
                        </button>
                        <button className="action-btn" onClick={() => openEditModal(link)} title="Edit Destination">
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn" onClick={() => navigate(`/links/${link.id}`)} title="View Analytics">
                          <BarChart2 size={16} />
                        </button>
                        <button className="action-btn delete" onClick={() => openDeleteModal(link)} title="Delete Link">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {links.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No links yet. Create your first short link above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Destination URL"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateLink}>Save Changes</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            Enter the new destination URL for <strong>{selectedLink?.short_code}</strong>:
          </p>
          <Input
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="https://example.com"
            autoFocus
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Link"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteLink}>Delete Forever</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            This will permanently delete the short link for:
          </p>
          <div style={{
            padding: '0.75rem',
            background: 'var(--bg-body)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>
            {selectedLink?.original_url}
          </div>
          <p style={{ margin: 0, color: 'var(--error)', fontSize: '0.875rem' }}>
            Warning: This action cannot be undone.
          </p>
        </div>
      </Modal>
    </Layout>
  );
}

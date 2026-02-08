import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/v1/profile').then(res => setProfile(res.data));
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText(profile.api_key);
    setCopied(true);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!profile) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} style={{ paddingLeft: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Button>
        </div>

        <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>My Profile</h2>

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Full Name</label>
              <div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{profile.name}</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email Address</label>
              <div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{profile.email}</div>
            </div>

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>API Key</label>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Use this key to authenticate with the API programmatically. Keep it secret!
              </p>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <code style={{ flex: 1, background: 'var(--bg-body)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                  {profile.api_key}
                </code>
                <Button onClick={copyApiKey} variant="outline" title="Copy API key">
                  {copied ? (
                    <>
                      <Check size={16} style={{ marginRight: '5px' }} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} style={{ marginRight: '5px' }} /> Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

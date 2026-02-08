import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/api/v1/profile').then(res => setProfile(res.data));
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText(profile.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!profile) return <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Profile</h2>
        <Link to="/dashboard" style={{ color: '#1a1a1a' }}>Back to Dashboard</Link>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Name:</strong> {profile.name}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Email:</strong> {profile.email}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>API Key:</strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
          <code style={{ background: '#f5f5f5', padding: '8px 12px', borderRadius: '4px', fontSize: '13px', wordBreak: 'break-all' }}>
            {profile.api_key}
          </code>
          <button
            onClick={copyApiKey}
            title="Copy API key"
            aria-label="Copy API key"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
          >
            {copied ? '✅' : '📋'}
          </button>
        </div>
      </div>
    </div>
  );
}

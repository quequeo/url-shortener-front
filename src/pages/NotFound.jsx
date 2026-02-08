import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '72px', margin: '0 0 10px' }}>404</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>Page not found</p>
      <Link to="/" style={{ color: '#1a1a1a' }}>Go to Dashboard</Link>
    </div>
  );
}

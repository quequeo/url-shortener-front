import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, marginBottom: '1rem' }}>404</h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Page not found</p>
        <Button onClick={() => navigate('/')} size="lg">
          Go to Dashboard
        </Button>
      </div>
    </Layout>
  );
}

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import './Navbar.css';
import { Link2, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const [isOpen, setIsOpen] = React.useState(false);

    // Close menu when route changes
    React.useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link2 size={24} />
                    <span>URL Shortener</span>
                </Link>

                <button
                    className="menu-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`navbar-nav ${isOpen ? 'open' : ''}`}>
                    <Link to="/top" className={`nav-link ${isActive('/top')}`}>
                        Top 100
                    </Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                                Dashboard
                            </Link>
                            <div className="user-menu">
                                <span className="user-name">{user.email}</span>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm">Register</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

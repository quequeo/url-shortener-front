import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout({ children }) {
    return (
        <div className="layout">
            <Navbar />
            <main className="main-content">
                {children}
            </main>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} URL Shortener. Built with React & Vite.</p>
            </footer>
            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                },
                success: {
                    iconTheme: {
                        primary: 'var(--primary)',
                        secondary: 'white',
                    },
                },
            }} />
        </div>
    );
}

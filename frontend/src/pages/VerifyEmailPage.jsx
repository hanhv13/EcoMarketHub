import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying...');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('No token provided.');
            setStatus('');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Verification failed');
                }

                setStatus('Email verified successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } catch (err) {
                setError(err.message);
                setStatus('');
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Email Verification</h2>
            {status && <p style={{ color: 'green', marginTop: '20px' }}>{status}</p>}
            {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
        </div>
    );
}

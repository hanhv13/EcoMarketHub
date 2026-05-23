import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await api.post('/api/auth/forgot-password', { email });
            setMessage(response.data.message || 'Password reset link has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>
            
            {message && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '4px' }}>{message}</div>}
            {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '15px', borderRadius: '4px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" disabled={loading} style={{ padding: '10px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <Link to="/login" style={{ color: '#2e7d32', textDecoration: 'none' }}>Back to Login</Link>
            </div>
        </div>
    );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/services/api';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            localStorage.setItem('chandufit_token', data.token);
            localStorage.setItem('chandufit_user', JSON.stringify(data.user));
            toast.success('Welcome back! 💪');
            router.push(data.user.height ? '/dashboard' : '/profile/setup');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally { setLoading(false); }
    };

    const inputStyle = {
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        color: '#1e293b', padding: '0.75rem 1rem', fontSize: '0.95rem', width: '100%',
        transition: 'all 0.2s',
    };
    const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #eff6ff 0%, #f8faff 40%, #ecfeff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/fitness-pattern.png)', backgroundSize: 'cover', opacity: 0.15 }} />
            <div style={{ width: '100%', maxWidth: 440, position: 'relative', animation: 'slideUp 0.5s ease' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem', marginBottom: 12, boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>FT</div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Welcome Back</h1>
                    <p style={{ color: '#64748b', marginTop: 4, fontSize: '0.9rem' }}>Log in to continue your fitness journey</p>
                </div>

                {/* Card */}
                <div style={{ background: '#fff', borderRadius: 18, padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(37,99,235,0.06)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input id="login-email" type="email" required style={inputStyle} placeholder="you@example.com"
                                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                        </div>
                        <div>
                            <label style={labelStyle}>Password</label>
                            <input id="login-password" type="password" required style={inputStyle} placeholder="••••••••" minLength={6}
                                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                        </div>
                        <button id="login-submit" type="submit" disabled={loading}
                            style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', padding: '0.85rem', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(37,99,235,0.3)', transition: 'all 0.2s' }}>
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
                </p>
            </div>
        </div>
    );
}

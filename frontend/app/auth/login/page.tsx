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
            toast.success(`Welcome back, ${data.user.name}! 🔥`);
            if (!data.user.profileComplete) {
                router.push('/profile/setup');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,107,53,0.12), transparent)' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #FF6B35, #E63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            ChanduFit
                        </span>
                    </Link>
                    <p style={{ color: '#666', marginTop: 6, fontSize: '0.9rem' }}>Welcome back. Let&apos;s get disciplined.</p>
                </div>

                {/* Card */}
                <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16, padding: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Login</h1>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#888' }}>Email</label>
                            <input id="login-email" type="email" className="input" placeholder="chandu@email.com" required
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#888' }}>Password</label>
                            <input id="login-password" type="password" className="input" placeholder="••••••••" required
                                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <button id="login-submit" type="submit" className="btn-primary" disabled={loading}
                            style={{ marginTop: '0.5rem', opacity: loading ? 0.7 : 1, background: 'linear-gradient(135deg, #FF6B35, #E63946)', color: '#fff', padding: '0.85rem', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                            {loading ? 'Logging in...' : 'Login 🔥'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
                        No account?{' '}
                        <Link href="/auth/signup" style={{ color: '#FF6B35', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

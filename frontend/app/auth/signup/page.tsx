'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/services/api';

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', dob: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) { toast.error('Passwords don\'t match'); return; }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/signup', { name: form.name, email: form.email, dob: form.dob, password: form.password });
            localStorage.setItem('chandufit_token', data.token);
            localStorage.setItem('chandufit_user', JSON.stringify(data.user));
            toast.success('Account created! 🚀');
            router.push('/profile/setup');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally { setLoading(false); }
    };

    const inputStyle = {
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
        color: '#1e293b', padding: '0.75rem 1rem', fontSize: '0.95rem', width: '100%',
    };
    const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #eff6ff 0%, #f8faff 40%, #ecfeff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/fitness-pattern.png)', backgroundSize: 'cover', opacity: 0.15 }} />
            <div style={{ width: '100%', maxWidth: 440, position: 'relative', animation: 'slideUp 0.5s ease' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem', marginBottom: 12, boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>FT</div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Create Account</h1>
                    <p style={{ color: '#64748b', marginTop: 4, fontSize: '0.9rem' }}>Start your fitness transformation</p>
                </div>

                <div style={{ background: '#fff', borderRadius: 18, padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(37,99,235,0.06)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" required style={inputStyle} placeholder="Your Name"
                                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input type="email" required style={inputStyle} placeholder="you@example.com"
                                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                        </div>
                        <div>
                            <label style={labelStyle}>Date of Birth</label>
                            <input type="date" required style={inputStyle}
                                value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                        </div>
                        <div>
                            <label style={labelStyle}>Password</label>
                            <input type="password" required style={inputStyle} placeholder="Min 6 characters" minLength={6}
                                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                        </div>
                        <div>
                            <label style={labelStyle}>Confirm Password</label>
                            <input type="password" required style={inputStyle} placeholder="Re-enter password" minLength={6}
                                value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
                        </div>
                        <button type="submit" disabled={loading}
                            style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', padding: '0.85rem', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                            {loading ? 'Creating...' : 'Create Account 🚀'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
}

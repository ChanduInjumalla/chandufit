'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/services/api';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirm: '', dob: ''
    });

    const handleFinalSubmit = async () => {
        if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/signup', {
                name: form.name, email: form.email, password: form.password, dob: form.dob
            });
            localStorage.setItem('chandufit_token', data.token);
            localStorage.setItem('chandufit_user', JSON.stringify(data.user));
            toast.success(`Account created! Let's set up your profile 💪`);
            router.push('/profile/setup');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { background: '#111', border: '1px solid #2A2A2A', borderRadius: 8, color: '#F0F0F0', padding: '0.75rem 1rem', fontSize: '0.95rem', width: '100%' };
    const labelStyle = { display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#888' } as React.CSSProperties;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,107,53,0.12), transparent)' }}>
            <div style={{ width: '100%', maxWidth: 440 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #FF6B35, #E63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            ChanduFit
                        </span>
                    </Link>
                    <p style={{ color: '#666', marginTop: 6, fontSize: '0.9rem' }}>Create your account. Start tracking.</p>
                </div>

                {/* Step indicator */}
                <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
                    {[1].map(s => (
                        <div key={s} style={{ flex: 1, height: 3, borderRadius: 100, background: step >= s ? 'linear-gradient(90deg,#FF6B35,#E63946)' : '#2A2A2A' }} />
                    ))}
                </div>

                <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16, padding: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Create Account</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input id="signup-name" type="text" style={inputStyle} placeholder="Chandu" required
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input id="signup-email" type="email" style={inputStyle} placeholder="chandu@email.com" required
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>Date of Birth</label>
                            <input id="signup-dob" type="date" style={inputStyle}
                                value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>Password</label>
                            <input id="signup-password" type="password" style={inputStyle} placeholder="Min. 6 characters" required
                                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>Confirm Password</label>
                            <input id="signup-confirm" type="password" style={inputStyle} placeholder="Repeat password" required
                                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
                        </div>
                        <button id="signup-submit" onClick={handleFinalSubmit} disabled={loading}
                            style={{ marginTop: '0.5rem', background: 'linear-gradient(135deg, #FF6B35, #E63946)', color: '#fff', padding: '0.85rem', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Creating Account...' : 'Create Account 🚀'}
                        </button>
                    </div>
                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
                        Already have an account?{' '}
                        <Link href="/auth/login" style={{ color: '#FF6B35', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [form, setForm] = useState({ height: '', weight: '', activityLevel: 'moderate', goal: 'fat_loss', bodyType: 'mesomorph', budget: 'medium' });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        try {
            const [userRes, metricsRes] = await Promise.all([api.get('/auth/me'), api.get('/user/metrics').catch(() => ({ data: null }))]);
            setUser(userRes.data); setMetrics(metricsRes.data);
            setForm({ height: userRes.data.height || '', weight: userRes.data.weight || '', activityLevel: userRes.data.activityLevel || 'moderate', goal: userRes.data.goal || 'fat_loss', bodyType: userRes.data.bodyType || 'mesomorph', budget: userRes.data.budget || 'medium' });
        } catch { router.push('/auth/login'); }
    }, [router]);

    useEffect(() => { const t = localStorage.getItem('chandufit_token'); if (!t) { router.push('/auth/login'); return; } load(); }, [load, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true);
        try { await api.put('/user/profile', { height: Number(form.height), weight: Number(form.weight), activityLevel: form.activityLevel, goal: form.goal, bodyType: form.bodyType, budget: form.budget }); toast.success('Profile updated! 💪'); load(); } catch { toast.error('Update failed'); }
        setSaving(false);
    };

    const inputStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#1e293b', padding: '0.65rem 0.9rem', fontSize: '0.9rem', width: '100%' };
    const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 5, fontSize: '0.8rem', color: '#64748b', fontWeight: 500 };

    if (!user) return <div style={{ minHeight: '100vh', background: '#f8faff' }}><Navbar /></div>;

    return (
        <div style={{ minHeight: '100vh', background: '#f8faff', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem', animation: 'fadeIn 0.5s ease' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>🧍 Profile</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>Update your stats. Metrics recalculate automatically.</p>

                {/* User Card */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        {(user.name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 4 }}>{user.email}</div>
                        {user.dob && <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 2 }}>DOB: {new Date(user.dob).toLocaleDateString('en-IN')}</div>}
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Discipline Score</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: (user.disciplineScore || 100) >= 80 ? '#10b981' : (user.disciplineScore || 100) >= 60 ? '#f59e0b' : '#ef4444' }}>
                            {user.disciplineScore ?? 100}
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                {metrics && (
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.9rem', color: '#2563eb' }}>📊 Current Metrics</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                            {[
                                { label: 'BMI', value: metrics.bmi, note: metrics.bmiCategory },
                                { label: 'BMR', value: `${metrics.bmr} kcal` },
                                { label: 'TDEE', value: `${metrics.tdee} kcal` },
                                { label: 'Target', value: `${metrics.targetCalories} kcal` },
                                { label: 'Body Fat', value: `${metrics.bodyFat}%` },
                            ].map(m => (
                                <div key={m.label} style={{ background: '#f8faff', borderRadius: 10, padding: '0.65rem 0.85rem', border: '1px solid #e2e8f0' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{m.label}</div>
                                    <div style={{ fontWeight: 700, marginTop: 2, color: '#0f172a' }}>{m.value}</div>
                                    {m.note && <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: 2 }}>{m.note}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: '#2563eb' }}>✏️ Update Stats</h2>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label style={labelStyle}>Height (cm)</label><input type="number" style={inputStyle} value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} placeholder="175" /></div>
                            <div><label style={labelStyle}>Weight (kg)</label><input type="number" style={inputStyle} value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="75" /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label style={labelStyle}>Activity Level</label>
                                <select style={inputStyle} value={form.activityLevel} onChange={e => setForm(f => ({ ...f, activityLevel: e.target.value }))}>
                                    <option value="sedentary">Sedentary</option><option value="light">Light</option><option value="moderate">Moderate</option><option value="heavy">Heavy</option>
                                </select></div>
                            <div><label style={labelStyle}>Goal</label>
                                <select style={inputStyle} value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}>
                                    <option value="fat_loss">Fat Loss</option><option value="muscle_gain">Muscle Gain</option><option value="maintain">Maintain</option>
                                </select></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label style={labelStyle}>Body Type</label>
                                <select style={inputStyle} value={form.bodyType} onChange={e => setForm(f => ({ ...f, bodyType: e.target.value }))}>
                                    <option value="ectomorph">Ectomorph</option><option value="mesomorph">Mesomorph</option><option value="endomorph">Endomorph</option>
                                </select></div>
                            <div><label style={labelStyle}>Budget</label>
                                <select style={inputStyle} value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}>
                                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                                </select></div>
                        </div>
                        <button type="submit" disabled={saving}
                            style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: '0.95rem', marginTop: '0.25rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                            {saving ? 'Saving...' : 'Save Changes 💾'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

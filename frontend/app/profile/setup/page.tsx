'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/services/api';

const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (desk job, no exercise)' },
    { value: 'light', label: 'Light (1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (3-5 days/week)' },
    { value: 'heavy', label: 'Heavy (6-7 days/week)' },
];

export default function ProfileSetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        height: '', weight: '', gender: 'male', activityLevel: 'moderate',
        goal: 'fat_loss', bodyType: 'mesomorph', budget: 'medium'
    });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    const inputStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#1e293b', padding: '0.75rem 1rem', fontSize: '0.95rem', width: '100%' };
    const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.height || !form.weight) { toast.error('Enter height and weight'); return; }
        setLoading(true);
        try {
            await api.put('/user/profile', { height: Number(form.height), weight: Number(form.weight), gender: form.gender, activityLevel: form.activityLevel, goal: form.goal, bodyType: form.bodyType, budget: form.budget });
            toast.success('Profile saved! Let\'s go 💪');
            router.push('/dashboard');
        } catch (err: any) { toast.error(err.response?.data?.message || 'Save failed'); }
        finally { setLoading(false); }
    };

    const radGroup = (name: string, options: { value: string; label: string }[], current: string) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {options.map(o => (
                <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 1rem', borderRadius: 10, border: `1.5px solid ${current === o.value ? '#2563eb' : '#e2e8f0'}`, background: current === o.value ? 'rgba(37,99,235,0.04)' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input type="radio" name={name} value={o.value} checked={current === o.value} onChange={() => set(name, o.value)} style={{ accentColor: '#2563eb' }} />
                    <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>{o.label}</span>
                </label>
            ))}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'linear-gradient(180deg, #eff6ff, #f8faff)', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 560, animation: 'fadeIn 0.5s ease' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem', marginBottom: 12 }}>FT</div>
                    <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a' }}>Set Up Your Profile</h1>
                    <p style={{ color: '#64748b', marginTop: 6, fontSize: '0.9rem' }}>Tell us about yourself — we&apos;ll calculate everything</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>📏 Body Stats</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label style={labelStyle}>Height (cm)</label><input type="number" style={inputStyle} placeholder="175" min="100" max="250" required value={form.height} onChange={e => set('height', e.target.value)} /></div>
                            <div><label style={labelStyle}>Weight (kg)</label><input type="number" style={inputStyle} placeholder="75" min="30" max="300" required value={form.weight} onChange={e => set('weight', e.target.value)} /></div>
                        </div>
                    </div>

                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>⚤ Gender</h2>
                        {radGroup('gender', [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], form.gender)}
                    </div>

                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>⚡ Activity Level</h2>
                        {radGroup('activityLevel', activityOptions, form.activityLevel)}
                    </div>

                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>🎯 Your Goal</h2>
                        {radGroup('goal', [{ value: 'fat_loss', label: '🔥 Fat Loss (TDEE - 500 kcal)' }, { value: 'muscle_gain', label: '💪 Muscle Gain (TDEE + 300 kcal)' }, { value: 'maintain', label: '⚖️ Maintain Weight' }], form.goal)}
                    </div>

                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>🧬 Body Type</h2>
                        {radGroup('bodyType', [{ value: 'ectomorph', label: 'Ectomorph (slim, hard to gain)' }, { value: 'mesomorph', label: 'Mesomorph (athletic)' }, { value: 'endomorph', label: 'Endomorph (stores fat easily)' }], form.bodyType)}
                    </div>

                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>💰 Diet Budget</h2>
                        {radGroup('budget', [{ value: 'low', label: '💸 Low (dal, rice, eggs)' }, { value: 'medium', label: '💵 Medium (+ chicken, paneer)' }, { value: 'high', label: '💎 High (+ whey, salmon)' }], form.budget)}
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', padding: '1rem', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                        {loading ? 'Saving...' : 'Save & Continue →'}
                    </button>
                </form>
            </div>
        </div>
    );
}

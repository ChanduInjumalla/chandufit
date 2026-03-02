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

    const inputStyle = { background: '#111', border: '1px solid #2A2A2A', borderRadius: 8, color: '#F0F0F0', padding: '0.75rem 1rem', fontSize: '0.95rem', width: '100%' };
    const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: '0.85rem', color: '#888' };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.height || !form.weight) { toast.error('Enter height and weight'); return; }
        setLoading(true);
        try {
            await api.put('/user/profile', {
                height: Number(form.height),
                weight: Number(form.weight),
                gender: form.gender,
                activityLevel: form.activityLevel,
                goal: form.goal,
                bodyType: form.bodyType,
                budget: form.budget,
            });
            toast.success('Profile saved! Time to grind 🔥');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Save failed');
        } finally {
            setLoading(false);
        }
    };

    const radGroup = (name: string, options: { value: string; label: string }[], current: string) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {options.map(o => (
                <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.65rem 1rem', borderRadius: 8, border: `1px solid ${current === o.value ? '#FF6B35' : '#2A2A2A'}`, background: current === o.value ? 'rgba(255,107,53,0.08)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input type="radio" name={name} value={o.value} checked={current === o.value} onChange={() => set(name, o.value)} style={{ accentColor: '#FF6B35' }} />
                    <span style={{ fontSize: '0.9rem' }}>{o.label}</span>
                </label>
            ))}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: '#0D0D0D', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 560 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Set Up Your Profile</h1>
                    <p style={{ color: '#666', marginTop: 6 }}>Give us your stats. We&apos;ll do the rest.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Body Stats */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16, padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>📏 Body Stats</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Height (cm)</label>
                                <input id="setup-height" type="number" style={inputStyle} placeholder="175" min="100" max="250" required
                                    value={form.height} onChange={e => set('height', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Weight (kg)</label>
                                <input id="setup-weight" type="number" style={inputStyle} placeholder="75" min="30" max="300" required
                                    value={form.weight} onChange={e => set('weight', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Gender */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16, padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>⚤ Gender</h2>
                        {radGroup('gender', [
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                        ], form.gender)}
                    </div>

                    {/* Activity Level */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16, padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>⚡ Activity Level</h2>
                        {radGroup('activityLevel', activityOptions, form.activityLevel)}
                    </div>

                    {/* Goal */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16, padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>🎯 Your Goal</h2>
                        {radGroup('goal', [
                            { value: 'fat_loss', label: '🔥 Fat Loss (TDEE - 500 kcal)' },
                            { value: 'muscle_gain', label: '💪 Muscle Gain (TDEE + 300 kcal)' },
                            { value: 'maintain', label: '⚖️ Maintain Weight (TDEE)' },
                        ], form.goal)}
                    </div>

                    {/* Body Type */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16, padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>🧬 Body Type</h2>
                        {radGroup('bodyType', [
                            { value: 'ectomorph', label: 'Ectomorph (naturally slim, hard to gain)' },
                            { value: 'mesomorph', label: 'Mesomorph (athletic, gains easily)' },
                            { value: 'endomorph', label: 'Endomorph (tends to store fat)' },
                        ], form.bodyType)}
                    </div>

                    {/* Budget */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16, padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>💰 Diet Budget</h2>
                        {radGroup('budget', [
                            { value: 'low', label: '💸 Low (dal, rice, eggs, peanuts)' },
                            { value: 'medium', label: '💵 Medium (+ chicken, paneer, curd)' },
                            { value: 'high', label: '💎 High (+ whey, salmon, avocado)' },
                        ], form.budget)}
                    </div>

                    <button id="setup-submit" type="submit" disabled={loading}
                        style={{ background: 'linear-gradient(135deg, #FF6B35, #E63946)', color: '#fff', padding: '1rem', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Saving...' : 'Save & Go to Dashboard 🚀'}
                    </button>
                </form>
            </div>
        </div>
    );
}

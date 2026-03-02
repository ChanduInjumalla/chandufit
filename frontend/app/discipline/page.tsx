'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function DisciplinePage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [recalculating, setRecalculating] = useState(false);

    const load = useCallback(async () => {
        try {
            const { data: d } = await api.get('/discipline/score');
            setData(d);
        } catch { router.push('/auth/login'); }
        setLoading(false);
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem('chandufit_token');
        if (!token) { router.push('/auth/login'); return; }
        load();
    }, [load, router]);

    const recalculate = async () => {
        setRecalculating(true);
        try {
            const { data: d } = await api.post('/discipline/recalculate');
            setData(d); toast.success('Score recalculated!');
        } catch { toast.error('Error recalculating'); }
        setRecalculating(false);
    };

    const resetScore = async () => {
        try {
            const { data: d } = await api.post('/discipline/reset');
            toast.success(d.message); load();
        } catch { toast.error('Error'); }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D0D' }}>
            <Navbar /><div style={{ color: '#888' }}>Loading discipline report...</div>
        </div>
    );

    const score = data?.score ?? 100;
    const status = data?.status ?? 'GOOD';
    const scoreColor = status === 'GOOD' ? '#4ade80' : status === 'WARNING' ? '#facc15' : '#E63946';
    const punishments = data?.punishments || [];
    const violations = data?.violations || [];

    const RULES: { id: string; label: string; deduction: number }[] = [
        { id: 'no_workout', label: 'No workout logged yesterday', deduction: 10 },
        { id: 'low_protein', label: 'Protein below 70% yesterday', deduction: 8 },
        { id: 'calorie_overshoot', label: 'Calories exceeded by 10%+ yesterday', deduction: 5 },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#0D0D0D', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>🚨 Discipline Mode</h1>
                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.875rem' }}>Miss a workout? Eat like trash? This page holds you accountable.</p>

                {/* Score Circle */}
                <div style={{ background: '#1A1A1A', border: `2px solid ${scoreColor}`, borderRadius: 16, padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${scoreColor}10, transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{ fontSize: '5rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: '1rem', color: '#888', marginTop: 8 }}>/ 100</div>
                    <div style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 700, color: scoreColor }}>
                        {status === 'GOOD' ? '🔥 You\'re Killing It!' : status === 'WARNING' ? '⚠️ Stay Focused' : '🚨 DANGER ZONE — Get Back on Track!'}
                    </div>

                    {/* Score Bar */}
                    <div style={{ height: 8, background: '#2A2A2A', borderRadius: 100, overflow: 'hidden', marginTop: '1.5rem' }}>
                        <div style={{ height: '100%', width: `${score}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`, borderRadius: 100, transition: 'width 0.8s ease' }} />
                    </div>
                </div>

                {/* Violations & Punishments */}
                {violations.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#E63946' }}>❌ Yesterday&apos;s Violations</h2>
                        {punishments.map((p: string, i: number) => (
                            <div key={i} style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: 10, padding: '0.9rem 1rem', marginBottom: 8, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                                <div style={{ color: '#F0F0F0', fontSize: '0.875rem', lineHeight: 1.5 }}>{p}</div>
                            </div>
                        ))}
                    </div>
                )}

                {violations.length === 0 && (
                    <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎉</span>
                        <div>
                            <div style={{ fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>No violations detected!</div>
                            <div style={{ color: '#888', fontSize: '0.8rem' }}>Great work yesterday. Keep the streak going!</div>
                        </div>
                    </div>
                )}

                {/* Rules Reference */}
                <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>📋 Scoring Rules</h2>
                    {RULES.map(r => (
                        <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: '1px solid #222' }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: violations.includes(r.id) ? '#E63946' : '#333' }} />
                                <span style={{ fontSize: '0.875rem', color: violations.includes(r.id) ? '#F0F0F0' : '#666' }}>{r.label}</span>
                            </div>
                            <span style={{ color: '#E63946', fontWeight: 700, fontSize: '0.875rem' }}>-{r.deduction}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', fontSize: '0.875rem' }}>
                        <span style={{ color: '#888' }}>Max deduction per day</span>
                        <span style={{ color: '#E63946', fontWeight: 700 }}>-23</span>
                    </div>
                </div>

                {/* Score scales */}
                <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#FF6B35' }}>🎯 Score Levels</h2>
                    {[
                        { range: '80–100', label: 'GOOD — Beast mode activated 🔥', color: '#4ade80' },
                        { range: '60–79', label: 'WARNING — You\'re slipping ⚠️', color: '#facc15' },
                        { range: '0–59', label: 'DANGER — No cheat meals. Extra cardio. 🚨', color: '#E63946' },
                    ].map(l => (
                        <div key={l.range} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #222' }}>
                            <div style={{ width: 40, fontSize: '0.75rem', color: l.color, fontWeight: 700 }}>{l.range}</div>
                            <div style={{ fontSize: '0.875rem', color: '#888' }}>{l.label}</div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={recalculate} disabled={recalculating}
                        style={{ flex: 1, background: 'linear-gradient(135deg, #FF6B35, #E63946)', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer', opacity: recalculating ? 0.7 : 1, fontSize: '0.9rem' }}>
                        {recalculating ? 'Checking...' : '🔄 Recalculate Score'}
                    </button>
                    <button onClick={resetScore}
                        style={{ background: 'transparent', border: '1px solid #2A2A2A', color: '#666', padding: '0.75rem 1rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                        Reset to 100
                    </button>
                </div>
            </div>
        </div>
    );
}

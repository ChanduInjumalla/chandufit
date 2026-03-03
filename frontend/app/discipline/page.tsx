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
        try { const { data: d } = await api.get('/discipline/score'); setData(d); } catch { router.push('/auth/login'); }
        setLoading(false);
    }, [router]);

    useEffect(() => { const t = localStorage.getItem('chandufit_token'); if (!t) { router.push('/auth/login'); return; } load(); }, [load, router]);

    const recalculate = async () => {
        setRecalculating(true);
        try { const { data: d } = await api.post('/discipline/recalculate'); setData(d); toast.success('Score recalculated!'); } catch { toast.error('Error'); }
        setRecalculating(false);
    };

    const resetScore = async () => {
        try { const { data: d } = await api.post('/discipline/reset'); toast.success(d.message); load(); } catch { toast.error('Error'); }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faff' }}>
            <Navbar /><div style={{ color: '#64748b' }}>Loading discipline...</div>
        </div>
    );

    const score = data?.score ?? 100;
    const status = data?.status ?? 'GOOD';
    const scoreColor = status === 'GOOD' ? '#10b981' : status === 'WARNING' ? '#f59e0b' : '#ef4444';
    const punishments = data?.punishments || [];
    const violations = data?.violations || [];

    const RULES = [
        { id: 'no_workout', label: 'No workout logged yesterday', deduction: 10 },
        { id: 'low_protein', label: 'Protein below 70% yesterday', deduction: 8 },
        { id: 'calorie_overshoot', label: 'Calories exceeded by 10%+ yesterday', deduction: 5 },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f8faff', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem', animation: 'fadeIn 0.5s ease' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>🚨 Discipline Mode</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>Miss a workout? Eat like trash? This page holds you accountable.</p>

                {/* Score Card */}
                <div style={{ background: '#fff', border: `2px solid ${scoreColor}`, borderRadius: 18, padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: `0 8px 30px ${scoreColor}15` }}>
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${scoreColor}08, transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{ fontSize: '5rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', marginTop: 8 }}>/ 100</div>
                    <div style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 700, color: scoreColor }}>
                        {status === 'GOOD' ? '🔥 You\'re Killing It!' : status === 'WARNING' ? '⚠️ Stay Focused' : '🚨 DANGER — Fix Now!'}
                    </div>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 100, overflow: 'hidden', marginTop: '1.5rem' }}>
                        <div style={{ height: '100%', width: `${score}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`, borderRadius: 100, transition: 'width 0.8s ease' }} />
                    </div>
                </div>

                {/* Violations */}
                {violations.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ef4444' }}>❌ Yesterday&apos;s Violations</h2>
                        {punishments.map((p: string, i: number) => (
                            <div key={i} style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '0.9rem 1rem', marginBottom: 8, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                                <div style={{ color: '#0f172a', fontSize: '0.875rem', lineHeight: 1.5 }}>{p}</div>
                            </div>
                        ))}
                    </div>
                )}

                {violations.length === 0 && (
                    <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎉</span>
                        <div><div style={{ fontWeight: 700, color: '#10b981', marginBottom: 4 }}>No violations!</div><div style={{ color: '#64748b', fontSize: '0.8rem' }}>Great work yesterday. Keep the streak going!</div></div>
                    </div>
                )}

                {/* Rules */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>📋 Scoring Rules</h2>
                    {RULES.map(r => (
                        <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: violations.includes(r.id) ? '#ef4444' : '#e2e8f0' }} />
                                <span style={{ fontSize: '0.875rem', color: violations.includes(r.id) ? '#0f172a' : '#94a3b8' }}>{r.label}</span>
                            </div>
                            <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.875rem' }}>-{r.deduction}</span>
                        </div>
                    ))}
                </div>

                {/* Score Levels */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#2563eb' }}>🎯 Score Levels</h2>
                    {[
                        { range: '80–100', label: 'GOOD — Beast mode 🔥', color: '#10b981' },
                        { range: '60–79', label: 'WARNING — Slipping ⚠️', color: '#f59e0b' },
                        { range: '0–59', label: 'DANGER — No cheat meals. Extra cardio 🚨', color: '#ef4444' },
                    ].map(l => (
                        <div key={l.range} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ width: 44, fontSize: '0.75rem', color: l.color, fontWeight: 700 }}>{l.range}</div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{l.label}</div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={recalculate} disabled={recalculating}
                        style={{ flex: 1, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', opacity: recalculating ? 0.7 : 1, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                        {recalculating ? 'Checking...' : '🔄 Recalculate Score'}
                    </button>
                    <button onClick={resetScore}
                        style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', padding: '0.75rem 1rem', borderRadius: 12, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                        Reset to 100
                    </button>
                </div>
            </div>
        </div>
    );
}

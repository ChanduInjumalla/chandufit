'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/services/api';

interface Metrics {
    bmi: number; bmiCategory: string; bmr: number; tdee: number;
    targetCalories: number; macros: { protein: number; carbs: number; fats: number };
    bodyFat: number; goal: string;
}
interface Summary { calories: number; protein: number; carbs: number; fats: number; }

const goalLabel: Record<string, string> = { fat_loss: '🔥 Fat Loss', muscle_gain: '💪 Muscle Gain', maintain: '⚖️ Maintain' };

export default function DashboardPage() {
    const router = useRouter();
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [summary, setSummary] = useState<Summary>({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [workoutDone, setWorkoutDone] = useState(false);
    const [discipline, setDiscipline] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Chandu');

    const loadAll = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('chandufit_user') || '{}');
            setUserName(user.name || 'Chandu');
            const [metricsRes, summaryRes, workoutRes, disciplineRes] = await Promise.all([
                api.get('/user/metrics').catch(() => ({ data: null })),
                api.get('/logs/summary').catch(() => ({ data: { calories: 0, protein: 0, carbs: 0, fats: 0 } })),
                api.get('/workouts/log/today').catch(() => ({ data: { completedToday: false } })),
                api.get('/discipline/score').catch(() => ({ data: null })),
            ]);
            setMetrics(metricsRes.data);
            setSummary(summaryRes.data);
            setWorkoutDone(workoutRes.data?.completedToday || false);
            setDiscipline(disciplineRes.data);
        } catch {
            router.push('/auth/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem('chandufit_token');
        if (!token) { router.push('/auth/login'); return; }
        loadAll();
    }, [loadAll, router]);

    const ProgressBar = ({ value, max, color = '#FF6B35' }: { value: number; max: number; color?: string }) => {
        const pct = Math.min((value / max) * 100, 100);
        return (
            <div style={{ height: 8, background: '#2A2A2A', borderRadius: 100, overflow: 'hidden', marginTop: 6 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 100, transition: 'width 0.6s ease' }} />
            </div>
        );
    };

    const scoreColor = discipline?.score >= 80 ? '#4ade80' : discipline?.score >= 60 ? '#facc15' : '#E63946';

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D0D' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚡</div>
                    <div style={{ color: '#888' }}>Loading your stats...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0D0D0D', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                        Hey, <span style={{ background: 'linear-gradient(135deg, #FF6B35, #E63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{userName}</span> 🔥
                    </h1>
                    <p style={{ color: '#666', marginTop: 4 }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>

                {/* Discipline Alert */}
                {discipline && discipline.score < 60 && (
                    <div style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.5)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <span style={{ fontSize: '1.5rem' }}>🚨</span>
                        <div>
                            <div style={{ fontWeight: 700, color: '#E63946', marginBottom: 4 }}>Discipline Score Critical!</div>
                            <div style={{ color: '#aaa', fontSize: '0.875rem' }}>{discipline.punishments?.[0] || 'Get back on track now!'}</div>
                        </div>
                    </div>
                )}

                {/* Top Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {/* Calories Today */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: 4 }}>🍽️ Calories Today</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{Math.round(summary.calories)}</div>
                        {metrics && <div style={{ color: '#555', fontSize: '0.8rem' }}>of {metrics.targetCalories} kcal</div>}
                        {metrics && <ProgressBar value={summary.calories} max={metrics.targetCalories} />}
                        {metrics && <div style={{ marginTop: 6, fontSize: '0.78rem', color: summary.calories > metrics.targetCalories ? '#E63946' : '#4ade80' }}>
                            {metrics.targetCalories - Math.round(summary.calories) > 0 ? `${metrics.targetCalories - Math.round(summary.calories)} kcal remaining` : 'Target reached!'}
                        </div>}
                    </div>

                    {/* Protein */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: 4 }}>💪 Protein</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{Math.round(summary.protein)}g</div>
                        {metrics && <div style={{ color: '#555', fontSize: '0.8rem' }}>target: {metrics.macros.protein}g</div>}
                        {metrics && <ProgressBar value={summary.protein} max={metrics.macros.protein} color="#3b82f6" />}
                        {metrics && <div style={{ marginTop: 6, fontSize: '0.78rem', color: '#888' }}>
                            {Math.round((summary.protein / metrics.macros.protein) * 100)}% complete
                        </div>}
                    </div>

                    {/* Workout Status */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: 4 }}>🏋️ Workout Today</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8 }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: workoutDone ? 'rgba(74,222,128,0.15)' : 'rgba(230,57,70,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                {workoutDone ? '✅' : '❌'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, color: workoutDone ? '#4ade80' : '#E63946' }}>
                                    {workoutDone ? 'Done! 🔥' : 'Not logged yet'}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#555', marginTop: 2 }}>
                                    {workoutDone ? 'Great work today' : 'Go hit the gym!'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Discipline Score */}
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: 4 }}>🎯 Discipline Score</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: scoreColor }}>{discipline?.score ?? 100}</div>
                        <div style={{ height: 8, background: '#2A2A2A', borderRadius: 100, overflow: 'hidden', marginTop: 8 }}>
                            <div style={{ height: '100%', width: `${discipline?.score ?? 100}%`, background: scoreColor, borderRadius: 100, transition: 'width 0.6s ease' }} />
                        </div>
                        <div style={{ marginTop: 6, fontSize: '0.78rem', color: '#666' }}>
                            {discipline?.status === 'GOOD' ? 'Killing it 💪' : discipline?.status === 'WARNING' ? 'Stay focused ⚠️' : 'Critical — fix now! 🚨'}
                        </div>
                    </div>
                </div>

                {/* Body Metrics Row */}
                {metrics ? (
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem', color: '#FF6B35' }}>📊 Your Body Metrics</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            {[
                                { label: 'BMI', value: metrics.bmi, sub: metrics.bmiCategory },
                                { label: 'BMR', value: `${metrics.bmr} kcal`, sub: 'Base metabolic rate' },
                                { label: 'TDEE', value: `${metrics.tdee} kcal`, sub: 'Daily burn estimate' },
                                { label: 'Target', value: `${metrics.targetCalories} kcal`, sub: goalLabel[metrics.goal] || metrics.goal },
                                { label: 'Body Fat', value: `${metrics.bodyFat}%`, sub: 'Estimated' },
                                { label: 'Protein Target', value: `${metrics.macros.protein}g`, sub: 'Per day' },
                                { label: 'Carbs Target', value: `${metrics.macros.carbs}g`, sub: 'Per day' },
                                { label: 'Fats Target', value: `${metrics.macros.fats}g`, sub: 'Per day' },
                            ].map(m => (
                                <div key={m.label} style={{ background: '#111', borderRadius: 10, padding: '0.75rem 1rem', border: '1px solid #222' }}>
                                    <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: 4 }}>{m.label}</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{m.value}</div>
                                    <div style={{ color: '#555', fontSize: '0.72rem', marginTop: 2 }}>{m.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#1A1A1A', border: '1px solid #FF6B35', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>Complete your profile to see metrics</div>
                            <div style={{ color: '#666', fontSize: '0.875rem' }}>Enter height, weight, and goal to get BMI, BMR, TDEE calculations</div>
                        </div>
                        <a href="/profile/setup" style={{ background: 'linear-gradient(135deg, #FF6B35, #E63946)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '1rem', fontSize: '0.875rem' }}>
                            Set Up →
                        </a>
                    </div>
                )}

                {/* Macro Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                        { label: 'Carbs', eaten: Math.round(summary.carbs), target: metrics?.macros.carbs || 0, color: '#facc15' },
                        { label: 'Fats', eaten: Math.round(summary.fats), target: metrics?.macros.fats || 0, color: '#a78bfa' },
                        { label: 'Protein', eaten: Math.round(summary.protein), target: metrics?.macros.protein || 0, color: '#38bdf8' },
                    ].map(m => (
                        <div key={m.label} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ color: '#888', fontSize: '0.8rem' }}>{m.label}</span>
                                <span style={{ fontSize: '0.8rem', color: m.color, fontWeight: 600 }}>{m.eaten}g / {m.target}g</span>
                            </div>
                            <div style={{ height: 6, background: '#2A2A2A', borderRadius: 100, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.min(m.target ? (m.eaten / m.target * 100) : 0, 100)}%`, background: m.color, borderRadius: 100 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

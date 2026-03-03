'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/services/api';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartOpts = () => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1, titleColor: '#0f172a', bodyColor: '#64748b', cornerRadius: 8, padding: 10 } },
    scales: {
        x: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11, family: 'Inter' } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11, family: 'Inter' } } },
    }
});

export default function ReportsPage() {
    const router = useRouter();
    const [weeklyCals, setWeeklyCals] = useState<any[]>([]);
    const [weightHistory, setWeightHistory] = useState<any[]>([]);
    const [consistency, setConsistency] = useState<any>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [newWeight, setNewWeight] = useState('');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const [calRes, weightRes, consRes, metRes] = await Promise.all([
                api.get('/logs/weekly'), api.get('/user/weight-history'), api.get('/workouts/consistency'), api.get('/user/metrics').catch(() => ({ data: null })),
            ]);
            setWeeklyCals(calRes.data); setWeightHistory(weightRes.data); setConsistency(consRes.data); setMetrics(metRes.data);
        } catch { router.push('/auth/login'); }
        setLoading(false);
    }, [router]);

    useEffect(() => { const t = localStorage.getItem('chandufit_token'); if (!t) { router.push('/auth/login'); return; } load(); }, [load, router]);

    const logWeight = async () => {
        if (!newWeight) return;
        try { await api.post('/user/weight', { weight: Number(newWeight) }); setNewWeight(''); load(); } catch { }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faff' }}>
            <Navbar /><div style={{ color: '#64748b' }}>Loading reports...</div>
        </div>
    );

    const labels = weeklyCals.map(d => new Date(d.date).toLocaleDateString('en', { weekday: 'short', day: 'numeric' }));
    const calData = { labels, datasets: [{ label: 'Calories', data: weeklyCals.map(d => d.calories), fill: true, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', tension: 0.4, pointBackgroundColor: '#2563eb', pointRadius: 4, borderWidth: 2 }] };
    const proteinData = { labels, datasets: [{ label: 'Protein (g)', data: weeklyCals.map(d => d.protein), backgroundColor: 'rgba(6,182,212,0.5)', borderColor: '#06b6d4', borderRadius: 6, borderWidth: 0 }] };
    const weightLabels = weightHistory.map(w => new Date(w.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }));
    const weightData = { labels: weightLabels, datasets: [{ label: 'Weight (kg)', data: weightHistory.map(w => w.weight), fill: true, borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.08)', tension: 0.4, pointBackgroundColor: '#8b5cf6', pointRadius: 4, borderWidth: 2 }] };
    const doneCount = consistency?.data?.filter((d: any) => d.completed).length || 0;
    const doughnutData = { labels: ['Completed', 'Missed'], datasets: [{ data: [doneCount, 7 - doneCount], backgroundColor: ['#10b981', '#e2e8f0'], borderWidth: 0, hoverOffset: 4 }] };

    const avgCals = weeklyCals.length ? Math.round(weeklyCals.reduce((s, d) => s + d.calories, 0) / weeklyCals.length) : 0;
    const avgProtein = weeklyCals.length ? Math.round(weeklyCals.reduce((s, d) => s + d.protein, 0) / weeklyCals.length) : 0;

    return (
        <div style={{ minHeight: '100vh', background: '#f8faff', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem', animation: 'fadeIn 0.5s ease' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>📈 Weekly Reports</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>Your last 7 days at a glance.</p>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        { label: 'Avg Calories/Day', value: `${avgCals}`, sub: metrics ? `target: ${metrics.targetCalories}` : '', color: '#2563eb' },
                        { label: 'Avg Protein/Day', value: `${avgProtein}g`, sub: metrics ? `target: ${metrics.macros?.protein}g` : '', color: '#06b6d4' },
                        { label: 'Workout Consistency', value: `${consistency?.consistency ?? 0}%`, sub: `${doneCount}/7 days`, color: '#10b981' },
                    ].map(card => (
                        <div key={card.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                            <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: 4 }}>{card.label}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: card.color }}>{card.value}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: 2 }}>{card.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Log Weight */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Log Today&apos;s Weight (kg)</label>
                        <input type="number" min={30} step={0.1} placeholder="e.g. 79.5" value={newWeight} onChange={e => setNewWeight(e.target.value)}
                            style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#1e293b', padding: '0.6rem 0.9rem', fontSize: '0.9rem', width: '100%' }} />
                    </div>
                    <button onClick={logWeight}
                        style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                        + Log Weight
                    </button>
                </div>

                {/* Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>🔥 Calories This Week</h2>
                        <div style={{ height: 200 }}>
                            {weeklyCals.some(d => d.calories > 0) ? <Line data={calData} options={chartOpts() as any} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1', fontSize: '0.875rem' }}>No data yet — start logging food!</div>}
                        </div>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#06b6d4' }}>💪 Protein This Week</h2>
                        <div style={{ height: 200 }}>
                            {weeklyCals.some(d => d.protein > 0) ? <Bar data={proteinData} options={chartOpts() as any} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1', fontSize: '0.875rem' }}>No protein data yet!</div>}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#8b5cf6' }}>⚖️ Weight Progress</h2>
                        <div style={{ height: 200 }}>
                            {weightHistory.length > 0 ? <Line data={weightData} options={chartOpts() as any} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1', fontSize: '0.875rem' }}>Log your weight to see progress!</div>}
                        </div>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#10b981' }}>🏋️ Consistency</h2>
                        <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Doughnut data={doughnutData} options={{ cutout: '72%', plugins: { legend: { display: false }, tooltip: { backgroundColor: '#fff', titleColor: '#0f172a', bodyColor: '#64748b', borderColor: '#e2e8f0', borderWidth: 1 } } }} />
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 8 }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{consistency?.consistency ?? 0}%</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>this week</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

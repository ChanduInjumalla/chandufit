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

const chartOptions = (label: string) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderWidth: 1, titleColor: '#F0F0F0', bodyColor: '#888' } },
    scales: {
        x: { grid: { color: '#1A1A1A' }, ticks: { color: '#555', font: { size: 11 } } },
        y: { grid: { color: '#1A1A1A' }, ticks: { color: '#555', font: { size: 11 } } },
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
                api.get('/logs/weekly'),
                api.get('/user/weight-history'),
                api.get('/workouts/consistency'),
                api.get('/user/metrics').catch(() => ({ data: null })),
            ]);
            setWeeklyCals(calRes.data);
            setWeightHistory(weightRes.data);
            setConsistency(consRes.data);
            setMetrics(metRes.data);
        } catch { router.push('/auth/login'); }
        setLoading(false);
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem('chandufit_token');
        if (!token) { router.push('/auth/login'); return; }
        load();
    }, [load, router]);

    const logWeight = async () => {
        if (!newWeight) return;
        try {
            await api.post('/user/weight', { weight: Number(newWeight) });
            setNewWeight(''); load();
        } catch { }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D0D' }}>
            <Navbar /><div style={{ color: '#888' }}>Loading reports...</div>
        </div>
    );

    const labels = weeklyCals.map(d => new Date(d.date).toLocaleDateString('en', { weekday: 'short', day: 'numeric' }));
    const calData = { labels, datasets: [{ label: 'Calories', data: weeklyCals.map(d => d.calories), fill: true, borderColor: '#FF6B35', backgroundColor: 'rgba(255,107,53,0.12)', tension: 0.4, pointBackgroundColor: '#FF6B35', pointRadius: 4 }] };
    const proteinData = { labels, datasets: [{ label: 'Protein (g)', data: weeklyCals.map(d => d.protein), backgroundColor: 'rgba(56,189,248,0.6)', borderColor: '#38bdf8', borderRadius: 6 }] };
    const weightLabels = weightHistory.map(w => new Date(w.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }));
    const weightData = { labels: weightLabels, datasets: [{ label: 'Weight (kg)', data: weightHistory.map(w => w.weight), fill: true, borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.12)', tension: 0.4, pointBackgroundColor: '#a78bfa', pointRadius: 4 }] };
    const doneCount = consistency?.data?.filter((d: any) => d.completed).length || 0;
    const doughnutData = { labels: ['Completed', 'Missed'], datasets: [{ data: [doneCount, 7 - doneCount], backgroundColor: ['#4ade80', '#2A2A2A'], borderWidth: 0, hoverOffset: 4 }] };

    const avgCals = weeklyCals.length ? Math.round(weeklyCals.reduce((s, d) => s + d.calories, 0) / weeklyCals.length) : 0;
    const avgProtein = weeklyCals.length ? Math.round(weeklyCals.reduce((s, d) => s + d.protein, 0) / weeklyCals.length) : 0;

    return (
        <div style={{ minHeight: '100vh', background: '#0D0D0D', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>📈 Weekly Reports</h1>
                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.875rem' }}>Your last 7 days at a glance.</p>

                {/* Summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        { label: 'Avg Calories/Day', value: `${avgCals}`, sub: metrics ? `target: ${metrics.targetCalories}` : '', color: '#FF6B35' },
                        { label: 'Avg Protein/Day', value: `${avgProtein}g`, sub: metrics ? `target: ${metrics.macros?.protein}g` : '', color: '#38bdf8' },
                        { label: 'Workout Consistency', value: `${consistency?.consistency ?? 0}%`, sub: `${doneCount}/7 days`, color: '#4ade80' },
                    ].map(card => (
                        <div key={card.label} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                            <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: 4 }}>{card.label}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: card.color }}>{card.value}</div>
                            <div style={{ color: '#555', fontSize: '0.75rem', marginTop: 2 }}>{card.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Log Weight */}
                <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: '0.8rem', color: '#888' }}>Log Today&apos;s Weight (kg)</label>
                        <input type="number" min={30} step={0.1} placeholder="e.g. 79.5" value={newWeight} onChange={e => setNewWeight(e.target.value)}
                            style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: 8, color: '#F0F0F0', padding: '0.6rem 0.9rem', fontSize: '0.9rem', width: '100%' }} />
                    </div>
                    <button onClick={logWeight}
                        style={{ background: 'linear-gradient(135deg,#FF6B35,#E63946)', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        + Log Weight
                    </button>
                </div>

                {/* Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>🔥 Calories This Week</h2>
                        <div style={{ height: 200 }}>
                            {weeklyCals.some(d => d.calories > 0) ? <Line data={calData} options={chartOptions('Calories') as any} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444', fontSize: '0.875rem' }}>No data yet — start logging food!</div>}
                        </div>
                    </div>
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#38bdf8' }}>💪 Protein This Week</h2>
                        <div style={{ height: 200 }}>
                            {weeklyCals.some(d => d.protein > 0) ? <Bar data={proteinData} options={chartOptions('Protein') as any} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444', fontSize: '0.875rem' }}>No protein data yet!</div>}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#a78bfa' }}>⚖️ Weight Progress</h2>
                        <div style={{ height: 200 }}>
                            {weightHistory.length > 0 ? <Line data={weightData} options={chartOptions('Weight') as any} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444', fontSize: '0.875rem' }}>Log your weight daily to see progress!</div>}
                        </div>
                    </div>
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#4ade80' }}>🏋️ Workout Consistency</h2>
                        <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Doughnut data={doughnutData} options={{ cutout: '70%', plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1A1A1A', titleColor: '#F0F0F0', bodyColor: '#888' } } }} />
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 8 }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80' }}>{consistency?.consistency ?? 0}%</div>
                            <div style={{ color: '#666', fontSize: '0.75rem' }}>this week</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Food { _id: string; name: string; teluguName: string; caloriesPer100g: number; protein: number; carbs: number; fats: number; region: string; }
interface LogEntry { _id: string; foodName: string; grams: number; meal: string; calories: number; protein: number; carbs: number; fats: number; }
const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_ICONS: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

export default function DietPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Food[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [grams, setGrams] = useState('100');
    const [meal, setMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
    const [log, setLog] = useState<LogEntry[]>([]);
    const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [metrics, setMetrics] = useState<any>(null);
    const [dietPlan, setDietPlan] = useState<any>(null);
    const [adding, setAdding] = useState(false);
    const [activeTab, setActiveTab] = useState<'log' | 'plan'>('log');

    const loadLog = useCallback(async () => {
        try {
            const [logRes, sumRes, metricsRes] = await Promise.all([
                api.get('/logs/daily'),
                api.get('/logs/summary'),
                api.get('/user/metrics').catch(() => ({ data: null })),
            ]);
            setLog(logRes.data?.entries || []);
            setSummary(sumRes.data);
            setMetrics(metricsRes.data);
        } catch { router.push('/auth/login'); }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem('chandufit_token');
        if (!token) { router.push('/auth/login'); return; }
        loadLog();
    }, [loadLog, router]);

    useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const { data } = await api.get(`/foods?search=${searchQuery}&limit=8`);
                setSearchResults(data);
            } catch { setSearchResults([]); }
            setSearching(false);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const addToLog = async () => {
        if (!selectedFood || !grams) return;
        setAdding(true);
        try {
            await api.post('/logs/daily', { foodId: selectedFood._id, grams: Number(grams), meal });
            toast.success(`Added ${selectedFood.name} ✅`);
            setSelectedFood(null); setSearchQuery(''); setGrams('100');
            loadLog();
        } catch { toast.error('Failed to add food'); }
        setAdding(false);
    };

    const removeEntry = async (entryId: string) => {
        try {
            await api.delete(`/logs/daily/${entryId}`);
            loadLog(); toast.success('Removed');
        } catch { toast.error('Failed to remove'); }
    };

    const loadDietPlan = async () => {
        try {
            const { data } = await api.get('/user/diet-plan');
            setDietPlan(data); setActiveTab('plan');
        } catch { toast.error('Complete profile first'); }
    };

    const calc = (food: Food, g: number) => ({
        cal: Math.round(food.caloriesPer100g * g / 100),
        pro: Math.round(food.protein * g / 100 * 10) / 10,
        carb: Math.round(food.carbs * g / 100 * 10) / 10,
        fat: Math.round(food.fats * g / 100 * 10) / 10,
    });

    const macroBar = (label: string, value: number, max: number, color: string) => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.78rem' }}>
                <span style={{ color: '#888' }}>{label}</span>
                <span style={{ color }}>{Math.round(value)}g / {max}g</span>
            </div>
            <div style={{ height: 5, background: '#2A2A2A', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(max ? (value / max) * 100 : 0, 100)}%`, background: color, borderRadius: 100 }} />
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#0D0D0D', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>🍛 Diet Planner</h1>
                    <button onClick={loadDietPlan} style={{ background: 'linear-gradient(135deg,#FF6B35,#E63946)', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                        ✨ Generate Smart Plan
                    </button>
                </div>

                {/* Daily Macro Summary */}
                <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 700 }}>Today — {Math.round(summary.calories)} kcal</span>
                        {metrics && <span style={{ color: '#666', fontSize: '0.8rem' }}>Target: {metrics.targetCalories} kcal</span>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        {macroBar('Protein', summary.protein, metrics?.macros.protein || 0, '#38bdf8')}
                        {macroBar('Carbs', summary.carbs, metrics?.macros.carbs || 0, '#facc15')}
                        {macroBar('Fats', summary.fats, metrics?.macros.fats || 0, '#a78bfa')}
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
                    {['log', 'plan'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t as any)}
                            style={{ padding: '0.5rem 1.25rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', background: activeTab === t ? 'linear-gradient(135deg,#FF6B35,#E63946)' : '#1A1A1A', color: activeTab === t ? '#fff' : '#888', transition: 'all 0.2s' }}>
                            {t === 'log' ? '📋 Food Log' : '📄 Smart Plan'}
                        </button>
                    ))}
                </div>

                {activeTab === 'log' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
                        {/* Left: Add Food */}
                        <div>
                            <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem' }}>
                                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>🔍 Search & Add Food</h2>

                                {/* Search */}
                                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                    <input type="text" placeholder="Search food... (e.g. chicken, rice)" value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setSelectedFood(null); }}
                                        style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: 8, color: '#F0F0F0', padding: '0.65rem 0.9rem', fontSize: '0.9rem', width: '100%' }} />
                                    {searching && <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#666' }}>...</div>}

                                    {searchResults.length > 0 && !selectedFood && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: 8, zIndex: 20, maxHeight: 260, overflowY: 'auto', marginTop: 4 }}>
                                            {searchResults.map(f => (
                                                <button key={f._id} onClick={() => { setSelectedFood(f); setSearchResults([]); }}
                                                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 0.9rem', background: 'transparent', border: 'none', borderBottom: '1px solid #2A2A2A', color: '#F0F0F0', cursor: 'pointer', fontSize: '0.875rem' }}>
                                                    <div style={{ fontWeight: 600 }}>{f.name}{f.teluguName && <span style={{ color: '#666', marginLeft: 6, fontSize: '0.8rem' }}>{f.teluguName}</span>}</div>
                                                    <div style={{ color: '#666', fontSize: '0.78rem', marginTop: 2 }}>
                                                        {f.caloriesPer100g} kcal · P:{f.protein}g · C:{f.carbs}g · F:{f.fats}g per 100g
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Selected food preview */}
                                {selectedFood && (
                                    <div style={{ background: '#111', border: '1px solid #FF6B35', borderRadius: 10, padding: '0.9rem', marginBottom: '0.9rem' }}>
                                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{selectedFood.name}</div>
                                        <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: 8 }}>Per 100g: {selectedFood.caloriesPer100g} kcal · P:{selectedFood.protein}g · C:{selectedFood.carbs}g · F:{selectedFood.fats}g</div>
                                        {(() => {
                                            const c = calc(selectedFood, Number(grams)); return (
                                                <div style={{ background: '#1A1A1A', borderRadius: 8, padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: '#aaa' }}>
                                                    For {grams}g → <strong style={{ color: '#FF6B35' }}>{c.cal} kcal</strong> · P:{c.pro}g · C:{c.carb}g · F:{c.fat}g
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* Grams + Meal */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontSize: '0.8rem', color: '#888' }}>Grams</label>
                                        <input type="number" min={1} placeholder="100" value={grams} onChange={e => setGrams(e.target.value)}
                                            style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: 8, color: '#F0F0F0', padding: '0.6rem 0.8rem', fontSize: '0.9rem', width: '100%' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontSize: '0.8rem', color: '#888' }}>Meal</label>
                                        <select value={meal} onChange={e => setMeal(e.target.value as any)}
                                            style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: 8, color: '#F0F0F0', padding: '0.6rem 0.8rem', fontSize: '0.9rem', width: '100%' }}>
                                            {MEALS.map(m => <option key={m} value={m}>{MEAL_ICONS[m]} {m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button onClick={addToLog} disabled={!selectedFood || adding}
                                    style={{ width: '100%', background: selectedFood ? 'linear-gradient(135deg, #FF6B35, #E63946)' : '#2A2A2A', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: 8, fontWeight: 700, cursor: selectedFood ? 'pointer' : 'not-allowed', fontSize: '0.9rem', opacity: adding ? 0.7 : 1 }}>
                                    {adding ? 'Adding...' : '+ Add to Log'}
                                </button>
                            </div>
                        </div>

                        {/* Right: Today's Log */}
                        <div>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>📋 Today&apos;s Log</h2>
                            {MEALS.map(m => {
                                const entries = log.filter(e => e.meal === m);
                                return (
                                    <div key={m} style={{ marginBottom: '1rem' }}>
                                        <div style={{ color: '#666', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>
                                            {MEAL_ICONS[m]} {m.toUpperCase()}
                                        </div>
                                        {entries.length === 0 ? (
                                            <div style={{ color: '#333', fontSize: '0.8rem', padding: '0.5rem 0' }}>Nothing logged yet</div>
                                        ) : (
                                            entries.map(e => (
                                                <div key={e._id} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, padding: '0.65rem 0.9rem', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{e.foodName}</div>
                                                        <div style={{ color: '#666', fontSize: '0.75rem', marginTop: 2 }}>
                                                            {e.grams}g · {Math.round(e.calories)} kcal · P:{Math.round(e.protein)}g · C:{Math.round(e.carbs)}g · F:{Math.round(e.fats)}g
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeEntry(e._id)} style={{ background: 'transparent', border: 'none', color: '#E63946', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '0 4px' }}>✕</button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'plan' && dietPlan && (
                    <div>
                        <div style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: 12, alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem' }}>🤖</span>
                            <div>
                                <div style={{ fontWeight: 700, marginBottom: 2 }}>Smart Diet Plan — {dietPlan.targetCalories} kcal/day</div>
                                <div style={{ color: '#888', fontSize: '0.8rem' }}>Protein: {dietPlan.macros?.protein}g · Carbs: {dietPlan.macros?.carbs}g · Fats: {dietPlan.macros?.fats}g</div>
                            </div>
                        </div>
                        {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map(m => (
                            <div key={m} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
                                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#F0F0F0' }}>
                                    {MEAL_ICONS[m]} {m.charAt(0).toUpperCase() + m.slice(1)}
                                </h3>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {(dietPlan[m] || []).map((item: string, i: number) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.75rem', background: '#111', borderRadius: 8, fontSize: '0.875rem' }}>
                                            <span style={{ color: '#FF6B35' }}>›</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'plan' && !dietPlan && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                        <p>Click &quot;Generate Smart Plan&quot; to get your personalized meal plan</p>
                    </div>
                )}
            </div>
        </div>
    );
}

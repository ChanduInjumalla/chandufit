'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Food { _id: string; name: string; teluguName: string; caloriesPer100g: number; protein: number; carbs: number; fats: number; region: string; }
interface LogEntry { _id: string; foodName: string; grams: number; meal: string; calories: number; protein: number; carbs: number; fats: number; }
const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_ICONS: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

// Helper: generate array of dates (past 30 days + today + next 7 days)
const generateDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = -14; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
    }
    return dates;
};

const formatDateKey = (d: Date) => d.toISOString().split('T')[0];
const isToday = (d: Date) => formatDateKey(d) === formatDateKey(new Date());
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Diet plan items per meal — This is the plan the user follows
interface MealItem { name: string; qty: string; cal: number; protein: number; }
interface DayPlan { breakfast: MealItem[]; lunch: MealItem[]; snack: MealItem[]; dinner: MealItem[]; }

const DEFAULT_PLAN: DayPlan = {
    breakfast: [
        { name: 'Oats with Milk', qty: '50g oats + 200ml milk', cal: 270, protein: 12 },
        { name: 'Boiled Eggs', qty: '3 eggs', cal: 210, protein: 18 },
        { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
    ],
    lunch: [
        { name: 'Brown Rice', qty: '150g cooked', cal: 170, protein: 4 },
        { name: 'Chicken Breast', qty: '150g', cal: 248, protein: 46 },
        { name: 'Dal (Lentils)', qty: '100g cooked', cal: 116, protein: 9 },
        { name: 'Mixed Vegetables', qty: '100g', cal: 65, protein: 3 },
    ],
    snack: [
        { name: 'Peanuts', qty: '30g', cal: 170, protein: 7 },
        { name: 'Protein Shake', qty: '1 scoop + water', cal: 120, protein: 24 },
    ],
    dinner: [
        { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
        { name: 'Paneer / Egg Curry', qty: '150g', cal: 260, protein: 20 },
        { name: 'Salad', qty: '1 bowl', cal: 50, protein: 2 },
    ],
};

// Storage helpers for eaten tracking
const getEatenKey = (date: string) => `fittracker_eaten_${date}`;
const getEatenState = (date: string): Record<string, boolean> => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(getEatenKey(date)) || '{}'); } catch { return {}; }
};
const setEatenState = (date: string, state: Record<string, boolean>) => {
    localStorage.setItem(getEatenKey(date), JSON.stringify(state));
};

// Storage for custom meal plans
const getPlanKey = () => 'fittracker_diet_plan';
const getSavedPlan = (): DayPlan | null => {
    if (typeof window === 'undefined') return null;
    try { const p = localStorage.getItem(getPlanKey()); return p ? JSON.parse(p) : null; } catch { return null; }
};
const savePlan = (plan: DayPlan) => { localStorage.setItem(getPlanKey(), JSON.stringify(plan)); };

export default function DietPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Food[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [grams, setGrams] = useState('100');
    const [meal, setMeal] = useState<string>('lunch');
    const [log, setLog] = useState<LogEntry[]>([]);
    const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [metrics, setMetrics] = useState<any>(null);
    const [adding, setAdding] = useState(false);
    const [activeTab, setActiveTab] = useState<'log' | 'tracker'>('tracker');

    // Calendar & tracker state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eatenItems, setEatenItems] = useState<Record<string, boolean>>({});
    const [mealPlan, setMealPlan] = useState<DayPlan>(DEFAULT_PLAN);
    const [editingPlan, setEditingPlan] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);
    const dates = generateDates();

    // Load eaten state when date changes
    useEffect(() => {
        const key = formatDateKey(selectedDate);
        setEatenItems(getEatenState(key));
    }, [selectedDate]);

    // Load saved plan on mount
    useEffect(() => {
        const saved = getSavedPlan();
        if (saved) setMealPlan(saved);
    }, []);

    // Scroll calendar to today on mount
    useEffect(() => {
        if (calendarRef.current) {
            const todayIdx = dates.findIndex(d => isToday(d));
            const scrollTo = Math.max(0, todayIdx - 3) * 62;
            calendarRef.current.scrollLeft = scrollTo;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadLog = useCallback(async () => {
        try {
            const [logRes, sumRes, metricsRes] = await Promise.all([
                api.get('/logs/daily'), api.get('/logs/summary'), api.get('/user/metrics').catch(() => ({ data: null })),
            ]);
            setLog(logRes.data?.entries || []); setSummary(sumRes.data); setMetrics(metricsRes.data);
        } catch { router.push('/auth/login'); }
    }, [router]);

    useEffect(() => { const t = localStorage.getItem('chandufit_token'); if (!t) { router.push('/auth/login'); return; } loadLog(); }, [loadLog, router]);
    useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        const timer = setTimeout(async () => {
            setSearching(true);
            try { const { data } = await api.get(`/foods?search=${searchQuery}&limit=8`); setSearchResults(data); } catch { setSearchResults([]); }
            setSearching(false);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const addToLog = async () => {
        if (!selectedFood || !grams) return;
        setAdding(true);
        try { await api.post('/logs/daily', { foodId: selectedFood._id, grams: Number(grams), meal }); toast.success(`Added ${selectedFood.name} ✅`); setSelectedFood(null); setSearchQuery(''); setGrams('100'); loadLog(); } catch { toast.error('Failed to add'); }
        setAdding(false);
    };

    const removeEntry = async (id: string) => { try { await api.delete(`/logs/daily/${id}`); loadLog(); toast.success('Removed'); } catch { toast.error('Failed'); } };

    const toggleEaten = (meal: string, idx: number) => {
        const key = `${meal}_${idx}`;
        const dateKey = formatDateKey(selectedDate);
        const newState = { ...eatenItems, [key]: !eatenItems[key] };
        setEatenItems(newState);
        setEatenState(dateKey, newState);
    };

    const calc = (food: Food, g: number) => ({ cal: Math.round(food.caloriesPer100g * g / 100), pro: +(food.protein * g / 100).toFixed(1), carb: +(food.carbs * g / 100).toFixed(1), fat: +(food.fats * g / 100).toFixed(1) });

    // Calculate tracker stats for selected date
    const allItems = [...mealPlan.breakfast, ...mealPlan.lunch, ...mealPlan.snack, ...mealPlan.dinner];
    const totalPlanCal = allItems.reduce((s, i) => s + i.cal, 0);
    const totalPlanProtein = allItems.reduce((s, i) => s + i.protein, 0);
    const eatenCount = Object.values(eatenItems).filter(Boolean).length;
    const totalItems = allItems.length;
    const adherence = totalItems > 0 ? Math.round((eatenCount / totalItems) * 100) : 0;
    const eatenCal = allItems.reduce((s, item, i) => {
        const mealName = i < mealPlan.breakfast.length ? 'breakfast' : i < mealPlan.breakfast.length + mealPlan.lunch.length ? 'lunch' : i < mealPlan.breakfast.length + mealPlan.lunch.length + mealPlan.snack.length ? 'snack' : 'dinner';
        const mealIdx = mealName === 'breakfast' ? i : mealName === 'lunch' ? i - mealPlan.breakfast.length : mealName === 'snack' ? i - mealPlan.breakfast.length - mealPlan.lunch.length : i - mealPlan.breakfast.length - mealPlan.lunch.length - mealPlan.snack.length;
        return s + (eatenItems[`${mealName}_${mealIdx}`] ? item.cal : 0);
    }, 0);
    const eatenProtein = allItems.reduce((s, item, i) => {
        const mealName = i < mealPlan.breakfast.length ? 'breakfast' : i < mealPlan.breakfast.length + mealPlan.lunch.length ? 'lunch' : i < mealPlan.breakfast.length + mealPlan.lunch.length + mealPlan.snack.length ? 'snack' : 'dinner';
        const mealIdx = mealName === 'breakfast' ? i : mealName === 'lunch' ? i - mealPlan.breakfast.length : mealName === 'snack' ? i - mealPlan.breakfast.length - mealPlan.lunch.length : i - mealPlan.breakfast.length - mealPlan.lunch.length - mealPlan.snack.length;
        return s + (eatenItems[`${mealName}_${mealIdx}`] ? item.protein : 0);
    }, 0);

    const macroBar = (label: string, value: number, max: number, color: string) => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.78rem' }}>
                <span style={{ color: '#64748b' }}>{label}</span><span style={{ color, fontWeight: 600 }}>{Math.round(value)}g / {max}g</span>
            </div>
            <div style={{ height: 5, background: '#e2e8f0', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(max ? (value / max) * 100 : 0, 100)}%`, background: color, borderRadius: 100 }} />
            </div>
        </div>
    );

    const inputStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#1e293b', padding: '0.65rem 0.9rem', fontSize: '0.9rem', width: '100%' };

    const renderMealTracker = (mealKey: string, items: MealItem[]) => {
        const mealEaten = items.filter((_, i) => eatenItems[`${mealKey}_${i}`]).length;
        const mealCal = items.reduce((s, item, i) => s + (eatenItems[`${mealKey}_${i}`] ? item.cal : 0), 0);
        const allEaten = items.length > 0 && mealEaten === items.length;

        return (
            <div key={mealKey} style={{ background: '#fff', border: `1.5px solid ${allEaten ? '#10b981' : '#e2e8f0'}`, borderRadius: 14, padding: '1rem 1.15rem', marginBottom: '0.75rem', boxShadow: allEaten ? '0 4px 14px rgba(16,185,129,0.08)' : '0 2px 8px rgba(37,99,235,0.03)', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.1rem' }}>{MEAL_ICONS[mealKey]}</span>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {allEaten && <span style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>✓ Complete</span>}
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{mealEaten}/{items.length} · {mealCal} kcal</span>
                    </div>
                </div>
                {items.map((item, i) => {
                    const eaten = eatenItems[`${mealKey}_${i}`];
                    return (
                        <div key={i} onClick={() => toggleEaten(mealKey, i)}
                            style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '0.6rem 0.75rem', marginBottom: 4, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', background: eaten ? 'rgba(16,185,129,0.04)' : '#f8faff', border: `1px solid ${eaten ? 'rgba(16,185,129,0.2)' : '#e2e8f0'}` }}>
                            {/* Checkbox */}
                            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${eaten ? '#10b981' : '#cbd5e1'}`, background: eaten ? '#10b981' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                                {eaten && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>✓</span>}
                            </div>
                            {/* Food info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: eaten ? '#10b981' : '#0f172a', textDecoration: eaten ? 'line-through' : 'none', transition: 'all 0.2s' }}>{item.name}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: 2 }}>{item.qty}</div>
                            </div>
                            {/* Nutrition */}
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: eaten ? '#10b981' : '#2563eb' }}>{item.cal} kcal</div>
                                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>P: {item.protein}g</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8faff', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>🍛 Diet Planner</h1>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
                    {[
                        { key: 'tracker', label: '📅 Meal Tracker', desc: 'Daily plan + check eaten' },
                        { key: 'log', label: '📋 Food Log', desc: 'Search & log food' },
                    ].map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 12, border: activeTab === t.key ? 'none' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: activeTab === t.key ? 'linear-gradient(135deg, #2563eb, #06b6d4)' : '#fff', color: activeTab === t.key ? '#fff' : '#64748b', boxShadow: activeTab === t.key ? '0 4px 14px rgba(37,99,235,0.25)' : '0 1px 4px rgba(0,0,0,0.02)' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.label}</span>
                            <span style={{ fontSize: '0.7rem', opacity: activeTab === t.key ? 0.85 : 0.7 }}>{t.desc}</span>
                        </button>
                    ))}
                </div>

                {/* ========== MEAL TRACKER TAB ========== */}
                {activeTab === 'tracker' && (
                    <div>
                        {/* Horizontal Calendar */}
                        <div ref={calendarRef} style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: '1.25rem', scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                            className="hide-scrollbar">
                            {dates.map((d, i) => {
                                const isSel = formatDateKey(d) === formatDateKey(selectedDate);
                                const isTod = isToday(d);
                                const dateKey = formatDateKey(d);
                                const dayEaten = getEatenState(dateKey);
                                const dayEatenCount = Object.values(dayEaten).filter(Boolean).length;
                                const dayTotal = allItems.length;
                                const dayDone = dayTotal > 0 && dayEatenCount === dayTotal;
                                const hasData = dayEatenCount > 0;

                                return (
                                    <button key={i} onClick={() => setSelectedDate(d)}
                                        style={{ minWidth: 56, padding: '0.5rem 0.4rem', borderRadius: 12, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', border: isSel ? '2px solid #2563eb' : isTod ? '2px solid #06b6d4' : '1px solid #e2e8f0', background: isSel ? 'linear-gradient(135deg, #2563eb, #06b6d4)' : '#fff', boxShadow: isSel ? '0 4px 14px rgba(37,99,235,0.2)' : 'none', flexShrink: 0 }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: isSel ? 'rgba(255,255,255,0.8)' : '#94a3b8', marginBottom: 2 }}>{dayNames[d.getDay()]}</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isSel ? '#fff' : '#0f172a' }}>{d.getDate()}</div>
                                        <div style={{ fontSize: '0.6rem', color: isSel ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}>{monthNames[d.getMonth()]}</div>
                                        {/* Status dot */}
                                        <div style={{ marginTop: 4, height: 6, width: 6, borderRadius: '50%', margin: '4px auto 0', background: dayDone ? '#10b981' : hasData ? '#f59e0b' : '#e2e8f0' }} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Date Header — STICKY */}
                        <div style={{ position: 'sticky', top: 64, zIndex: 30, background: '#f8faff', paddingTop: 8, paddingBottom: 4 }}>
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '0.85rem 1.25rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', boxShadow: '0 2px 12px rgba(37,99,235,0.06)' }}>
                                <div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                                        {isToday(selectedDate) ? '📅 Today' : `📅 ${selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}`}
                                    </div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 2 }}>
                                        {eatenCount}/{totalItems} items eaten · {adherence}% adherence
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: adherence >= 80 ? '#10b981' : adherence >= 50 ? '#f59e0b' : '#ef4444' }}>{adherence}%</div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Adherence</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#2563eb' }}>{eatenCal}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>kcal eaten</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#06b6d4' }}>{eatenProtein}g</div>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>protein</div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ marginBottom: 4 }}>
                                <div style={{ height: 6, background: '#e2e8f0', borderRadius: 100, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${adherence}%`, background: adherence >= 80 ? 'linear-gradient(90deg, #10b981, #06b6d4)' : adherence >= 50 ? 'linear-gradient(90deg, #f59e0b, #eab308)' : 'linear-gradient(90deg, #ef4444, #f97316)', borderRadius: 100, transition: 'width 0.5s ease' }} />
                                </div>
                            </div>
                        </div> {/* end sticky wrapper */}


                        {/* Meal Plans with Checkboxes */}
                        {renderMealTracker('breakfast', mealPlan.breakfast)}
                        {renderMealTracker('lunch', mealPlan.lunch)}
                        {renderMealTracker('snack', mealPlan.snack)}
                        {renderMealTracker('dinner', mealPlan.dinner)}

                        {/* Summary Card */}
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#2563eb' }}>📊 Plan Totals</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                {[
                                    { label: 'Total Calories', value: `${totalPlanCal}`, sub: `Eaten: ${eatenCal}`, color: '#2563eb' },
                                    { label: 'Total Protein', value: `${totalPlanProtein}g`, sub: `Eaten: ${eatenProtein}g`, color: '#06b6d4' },
                                    { label: 'Items Eaten', value: `${eatenCount}/${totalItems}`, sub: `${adherence}%`, color: '#10b981' },
                                    { label: 'Remaining', value: `${totalPlanCal - eatenCal}`, sub: 'kcal left', color: '#f59e0b' },
                                ].map(c => (
                                    <div key={c.label} style={{ background: '#f8faff', borderRadius: 10, padding: '0.65rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                        <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{c.label}</div>
                                        <div style={{ fontWeight: 800, color: c.color, fontSize: '1.1rem', marginTop: 2 }}>{c.value}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.65rem', marginTop: 2 }}>{c.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== FOOD LOG TAB ========== */}
                {activeTab === 'log' && (
                    <div>
                        {/* Summary */}
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>Today — {Math.round(summary.calories)} kcal</span>
                                {metrics && <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Target: {metrics.targetCalories} kcal</span>}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                {macroBar('Protein', summary.protein, metrics?.macros.protein || 0, '#06b6d4')}
                                {macroBar('Carbs', summary.carbs, metrics?.macros.carbs || 0, '#f59e0b')}
                                {macroBar('Fats', summary.fats, metrics?.macros.fats || 0, '#8b5cf6')}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
                            {/* Add Food */}
                            <div>
                                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>🔍 Search & Add Food</h2>
                                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                        <input type="text" placeholder="Search food... (e.g. chicken, rice)" value={searchQuery}
                                            onChange={e => { setSearchQuery(e.target.value); setSelectedFood(null); }} style={inputStyle} />
                                        {searching && <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }}>...</div>}
                                        {searchResults.length > 0 && !selectedFood && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, zIndex: 20, maxHeight: 260, overflowY: 'auto', marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                                                {searchResults.map(f => (
                                                    <button key={f._id} onClick={() => { setSelectedFood(f); setSearchResults([]); }}
                                                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 0.9rem', background: 'transparent', border: 'none', borderBottom: '1px solid #f1f5f9', color: '#1e293b', cursor: 'pointer', fontSize: '0.875rem' }}>
                                                        <div style={{ fontWeight: 600 }}>{f.name}{f.teluguName && <span style={{ color: '#94a3b8', marginLeft: 6, fontSize: '0.8rem' }}>{f.teluguName}</span>}</div>
                                                        <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 2 }}>{f.caloriesPer100g} kcal · P:{f.protein}g · C:{f.carbs}g · F:{f.fats}g per 100g</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {selectedFood && (
                                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '0.9rem', marginBottom: '0.9rem' }}>
                                            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{selectedFood.name}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 8 }}>Per 100g: {selectedFood.caloriesPer100g} kcal</div>
                                            {(() => {
                                                const c = calc(selectedFood, Number(grams)); return (
                                                    <div style={{ background: '#fff', borderRadius: 8, padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                                                        For {grams}g → <strong style={{ color: '#2563eb' }}>{c.cal} kcal</strong> · P:{c.pro}g · C:{c.carb}g · F:{c.fat}g
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
                                        <div><label style={{ display: 'block', marginBottom: 4, fontSize: '0.8rem', color: '#64748b' }}>Grams</label>
                                            <input type="number" min={1} placeholder="100" value={grams} onChange={e => setGrams(e.target.value)} style={inputStyle} /></div>
                                        <div><label style={{ display: 'block', marginBottom: 4, fontSize: '0.8rem', color: '#64748b' }}>Meal</label>
                                            <select value={meal} onChange={e => setMeal(e.target.value)} style={inputStyle}>
                                                {MEALS.map(m => <option key={m} value={m}>{MEAL_ICONS[m]} {m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                                            </select></div>
                                    </div>

                                    <button onClick={addToLog} disabled={!selectedFood || adding}
                                        style={{ width: '100%', background: selectedFood ? 'linear-gradient(135deg, #2563eb, #06b6d4)' : '#e2e8f0', color: selectedFood ? '#fff' : '#94a3b8', border: 'none', padding: '0.75rem', borderRadius: 10, fontWeight: 700, cursor: selectedFood ? 'pointer' : 'not-allowed', fontSize: '0.9rem', opacity: adding ? 0.7 : 1, boxShadow: selectedFood ? '0 4px 14px rgba(37,99,235,0.3)' : 'none' }}>
                                        {adding ? 'Adding...' : '+ Add to Log'}
                                    </button>
                                </div>
                            </div>

                            {/* Today's Log */}
                            <div>
                                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>📋 Today&apos;s Log</h2>
                                {MEALS.map(m => {
                                    const entries = log.filter(e => e.meal === m);
                                    return (
                                        <div key={m} style={{ marginBottom: '1rem' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>{MEAL_ICONS[m]} {m.toUpperCase()}</div>
                                            {entries.length === 0 ? (
                                                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', padding: '0.5rem 0' }}>Nothing logged</div>
                                            ) : entries.map(e => (
                                                <div key={e._id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.65rem 0.9rem', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{e.foodName}</div>
                                                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: 2 }}>{e.grams}g · {Math.round(e.calories)} kcal · P:{Math.round(e.protein)}g</div>
                                                    </div>
                                                    <button onClick={() => removeEntry(e._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}>✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/services/api';
import { getPlanForDate, BUDGET_LABELS, type BudgetType, type DayPlan, type MealItem, type UserMetrics } from '@/data/dietPlans';

interface Metrics { bmi: number; bmiCategory: string; bmr: number; tdee: number; targetCalories: number; macros: { protein: number; carbs: number; fats: number }; bodyFat: number; goal: string; }
interface Summary { calories: number; protein: number; carbs: number; fats: number; }
const goalLabel: Record<string, string> = { fat_loss: '🔥 Fat Loss', muscle_gain: '💪 Muscle Gain', maintain: '⚖️ Maintain' };
const MEAL_ICONS: Record<string, string> = { breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙' };

const getTodayKey = () => new Date().toISOString().split('T')[0];
const getEatenState = (): Record<string, boolean> => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(`fittracker_eaten_${getTodayKey()}`) || '{}'); } catch { return {}; }
};
const getBudget = (): BudgetType => {
    if (typeof window === 'undefined') return 'medium';
    try { const u = JSON.parse(localStorage.getItem('chandufit_user') || '{}'); return (u.budget as BudgetType) || 'medium'; } catch { return 'medium'; }
};

export default function DashboardPage() {
    const router = useRouter();
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [summary, setSummary] = useState<Summary>({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [workoutDone, setWorkoutDone] = useState(false);
    const [discipline, setDiscipline] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [eatenItems, setEatenItems] = useState<Record<string, boolean>>({});
    const [budget, setBudget] = useState<BudgetType>('medium');

    // Build user metrics for scaling
    const userMetrics: UserMetrics | null = useMemo(() => metrics ? {
        targetCalories: metrics.targetCalories,
        proteinTarget: metrics.macros?.protein || 0,
        weight: 75, // default, actual weight from API
        goal: metrics.goal || 'fat_loss',
    } : null, [metrics]);

    const mealPlan = useMemo(() => getPlanForDate(budget, new Date(), userMetrics), [budget, userMetrics]);
    const budgetInfo = BUDGET_LABELS[budget];
    const allMeals = ['breakfast', 'lunch', 'snack', 'dinner'] as const;

    const loadAll = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem('chandufit_user') || '{}');
            setUserName(user.name || 'User');
            setBudget((user.budget as BudgetType) || 'medium');
            setEatenItems(getEatenState());
            const [metricsRes, summaryRes, workoutRes, disciplineRes] = await Promise.all([
                api.get('/user/metrics').catch(() => ({ data: null })),
                api.get('/logs/summary').catch(() => ({ data: { calories: 0, protein: 0, carbs: 0, fats: 0 } })),
                api.get('/workouts/log/today').catch(() => ({ data: { completedToday: false } })),
                api.get('/discipline/score').catch(() => ({ data: null })),
            ]);
            setMetrics(metricsRes.data); setSummary(summaryRes.data);
            setWorkoutDone(workoutRes.data?.completedToday || false);
            setDiscipline(disciplineRes.data);
        } catch { router.push('/auth/login'); }
        finally { setLoading(false); }
    }, [router]);

    useEffect(() => { const t = localStorage.getItem('chandufit_token'); if (!t) { router.push('/auth/login'); return; } loadAll(); }, [loadAll, router]);
    useEffect(() => {
        const handleFocus = () => { setEatenItems(getEatenState()); setBudget(getBudget()); };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    // Diet tracker calculations
    const allItems = [...mealPlan.breakfast, ...mealPlan.lunch, ...mealPlan.snack, ...mealPlan.dinner];
    const totalItems = allItems.length;
    const eatenCount = Object.values(eatenItems).filter(Boolean).length;
    const adherence = totalItems > 0 ? Math.round((eatenCount / totalItems) * 100) : 0;
    const getMealEatenCals = (key: string, items: MealItem[]) => items.reduce((s, item, i) => s + (eatenItems[`${key}_${i}`] ? item.cal : 0), 0);
    const getMealEatenProtein = (key: string, items: MealItem[]) => items.reduce((s, item, i) => s + (eatenItems[`${key}_${i}`] ? item.protein : 0), 0);
    const getMealEatenCount = (key: string, items: MealItem[]) => items.filter((_, i) => eatenItems[`${key}_${i}`]).length;
    const totalEatenCal = getMealEatenCals('breakfast', mealPlan.breakfast) + getMealEatenCals('lunch', mealPlan.lunch) + getMealEatenCals('snack', mealPlan.snack) + getMealEatenCals('dinner', mealPlan.dinner);
    const totalEatenProtein = getMealEatenProtein('breakfast', mealPlan.breakfast) + getMealEatenProtein('lunch', mealPlan.lunch) + getMealEatenProtein('snack', mealPlan.snack) + getMealEatenProtein('dinner', mealPlan.dinner);
    const totalPlanCal = allItems.reduce((s, i) => s + i.cal, 0);
    const combinedCal = summary.calories + totalEatenCal;
    const combinedProtein = summary.protein + totalEatenProtein;

    const ProgressBar = ({ value, max, color = '#2563eb' }: { value: number; max: number; color?: string }) => (
        <div style={{ height: 7, background: '#e2e8f0', borderRadius: 100, overflow: 'hidden', marginTop: 6 }}>
            <div style={{ height: '100%', width: `${Math.min(max > 0 ? (value / max) * 100 : 0, 100)}%`, background: color, borderRadius: 100, transition: 'width 0.6s ease' }} />
        </div>
    );

    const scoreColor = discipline?.score >= 80 ? '#10b981' : discipline?.score >= 60 ? '#f59e0b' : '#ef4444';

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faff' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div><div style={{ color: '#64748b' }}>Loading your stats...</div></div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8faff', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', animation: 'fadeIn 0.5s ease' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
                        Welcome, <span style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{userName}</span> 👋
                    </h1>
                    <p style={{ color: '#64748b', marginTop: 4 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>

                {discipline && discipline.score < 60 && (
                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <span style={{ fontSize: '1.4rem' }}>🚨</span>
                        <div><div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>Discipline Score Critical!</div><div style={{ color: '#64748b', fontSize: '0.85rem' }}>{discipline.punishments?.[0] || 'Get back on track!'}</div></div>
                    </div>
                )}

                {/* Top Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Calories — Food Log + Meal Tracker combined */}
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 4 }}>🍽️ Calories Today</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{Math.round(combinedCal)}</div>
                        {metrics && <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>of {metrics.targetCalories} kcal</div>}
                        {metrics && <ProgressBar value={combinedCal} max={metrics.targetCalories} />}
                        {metrics && <div style={{ marginTop: 6, fontSize: '0.78rem', color: combinedCal > metrics.targetCalories ? '#ef4444' : '#10b981' }}>
                            {metrics.targetCalories - Math.round(combinedCal) > 0 ? `${metrics.targetCalories - Math.round(combinedCal)} kcal remaining` : 'Target hit! 🎉'}
                        </div>}
                        {totalEatenCal > 0 && <div style={{ marginTop: 4, fontSize: '0.7rem', color: '#94a3b8' }}>📅 {totalEatenCal} from meal plan · {Math.round(summary.calories)} from food log</div>}
                    </div>

                    {/* Protein — combined */}
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 4 }}>💪 Protein</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{Math.round(combinedProtein)}g</div>
                        {metrics && <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>target: {metrics.macros.protein}g</div>}
                        {metrics && <ProgressBar value={combinedProtein} max={metrics.macros.protein} color="#06b6d4" />}
                        {metrics && <div style={{ marginTop: 6, fontSize: '0.78rem', color: '#64748b' }}>{Math.round((combinedProtein / metrics.macros.protein) * 100)}% complete</div>}
                        {totalEatenProtein > 0 && <div style={{ marginTop: 4, fontSize: '0.7rem', color: '#94a3b8' }}>📅 {totalEatenProtein}g from meal plan · {Math.round(summary.protein)}g from food log</div>}
                    </div>

                    {/* Diet Adherence */}
                    <Link href="/diet" style={{ textDecoration: 'none' }}>
                        <div style={{ background: '#fff', border: `1.5px solid ${adherence >= 80 ? '#10b981' : adherence >= 50 ? '#f59e0b' : '#e2e8f0'}`, borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)', cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 4 }}>🥗 Diet Adherence</div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: adherence >= 80 ? '#10b981' : adherence >= 50 ? '#f59e0b' : '#ef4444' }}>{adherence}%</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{eatenCount}/{totalItems} meals eaten</div>
                            <ProgressBar value={eatenCount} max={totalItems} color={adherence >= 80 ? '#10b981' : adherence >= 50 ? '#f59e0b' : '#ef4444'} />
                            <div style={{ marginTop: 6, fontSize: '0.78rem', color: '#64748b' }}>
                                {adherence === 100 ? 'All meals done! 🎉' : adherence >= 80 ? 'Almost there! 💪' : adherence >= 50 ? 'Keep eating! 🍽️' : 'Start your meals →'}
                            </div>
                        </div>
                    </Link>

                    {/* Discipline */}
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 4 }}>🎯 Discipline Score</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: scoreColor }}>{discipline?.score ?? 100}</div>
                        <ProgressBar value={discipline?.score ?? 100} max={100} color={scoreColor} />
                        <div style={{ marginTop: 6, fontSize: '0.78rem', color: '#64748b' }}>
                            {discipline?.status === 'GOOD' ? 'Excellent! 🔥' : discipline?.status === 'WARNING' ? 'Stay focused ⚠️' : 'Critical 🚨'}
                        </div>
                    </div>
                </div>

                {/* Today's Meals Grid */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#2563eb' }}>🍛 Today&apos;s Meals</h2>
                            <span style={{ background: `${budgetInfo.color}15`, color: budgetInfo.color, padding: '2px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700 }}>{budgetInfo.emoji} {budgetInfo.label}</span>
                        </div>
                        <Link href="/diet" style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>Open Tracker →</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
                        {allMeals.map(mealKey => {
                            const items = mealPlan[mealKey];
                            const eaten = getMealEatenCount(mealKey, items);
                            const total = items.length;
                            const cal = getMealEatenCals(mealKey, items);
                            const done = total > 0 && eaten === total;
                            const started = eaten > 0;
                            return (
                                <Link key={mealKey} href="/diet" style={{ textDecoration: 'none' }}>
                                    <div style={{ background: done ? 'rgba(16,185,129,0.04)' : '#f8faff', border: `1.5px solid ${done ? '#10b981' : started ? '#f59e0b' : '#e2e8f0'}`, borderRadius: 12, padding: '0.75rem', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
                                        <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{MEAL_ICONS[mealKey]}</div>
                                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a', marginBottom: 2, textTransform: 'capitalize' }}>{mealKey}</div>
                                        <div style={{ fontSize: '0.72rem', color: done ? '#10b981' : '#94a3b8', fontWeight: 600 }}>{eaten}/{total} eaten</div>
                                        <div style={{ height: 4, background: '#e2e8f0', borderRadius: 100, overflow: 'hidden', marginTop: 6 }}>
                                            <div style={{ height: '100%', width: `${total > 0 ? (eaten / total) * 100 : 0}%`, background: done ? '#10b981' : started ? '#f59e0b' : '#e2e8f0', borderRadius: 100 }} />
                                        </div>
                                        <div style={{ marginTop: 4, fontSize: '0.68rem', color: '#94a3b8' }}>{cal} kcal</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {eatenCount > 0 && (
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                            <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: 6, fontWeight: 600 }}>✅ EATEN TODAY</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {allMeals.map(mealKey =>
                                    mealPlan[mealKey].map((item, i) =>
                                        eatenItems[`${mealKey}_${i}`] ? (
                                            <span key={`${mealKey}_${i}`} style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '3px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600 }}>
                                                ✓ {item.name}
                                            </span>
                                        ) : null
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Workout + Meal Summary Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 4 }}>🏋️ Workout Today</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8 }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: workoutDone ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                                {workoutDone ? '✅' : '❌'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, color: workoutDone ? '#10b981' : '#ef4444' }}>{workoutDone ? 'Done! 💪' : 'Not logged'}</div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{workoutDone ? 'Great work today' : 'Go hit the gym!'}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 8 }}>📊 Meal Plan Progress</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <div style={{ background: '#f8faff', borderRadius: 8, padding: '0.5rem 0.7rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Plan Calories</div>
                                <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '1rem' }}>{totalEatenCal} / {totalPlanCal}</div>
                            </div>
                            <div style={{ background: '#f8faff', borderRadius: 8, padding: '0.5rem 0.7rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Plan Protein</div>
                                <div style={{ fontWeight: 800, color: '#06b6d4', fontSize: '1rem' }}>{totalEatenProtein}g eaten</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Metrics */}
                {metrics ? (
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem', color: '#2563eb' }}>📊 Your Body Metrics</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            {[
                                { label: 'BMI', value: metrics.bmi, sub: metrics.bmiCategory },
                                { label: 'BMR', value: `${metrics.bmr} kcal`, sub: 'Base metabolic rate' },
                                { label: 'TDEE', value: `${metrics.tdee} kcal`, sub: 'Daily burn' },
                                { label: 'Target', value: `${metrics.targetCalories} kcal`, sub: goalLabel[metrics.goal] || metrics.goal },
                                { label: 'Body Fat', value: `${metrics.bodyFat}%`, sub: 'Estimated' },
                                { label: 'Protein', value: `${metrics.macros.protein}g/day`, sub: '2g/kg' },
                                { label: 'Carbs', value: `${metrics.macros.carbs}g/day`, sub: 'Remaining' },
                                { label: 'Fats', value: `${metrics.macros.fats}g/day`, sub: '0.8g/kg' },
                            ].map(m => (
                                <div key={m.label} style={{ background: '#f8faff', borderRadius: 10, padding: '0.75rem 1rem', border: '1px solid #e2e8f0' }}>
                                    <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: 3 }}>{m.label}</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>{m.value}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: 2 }}>{m.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#fff', border: '1.5px solid #2563eb', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div><div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Complete your profile to see metrics</div><div style={{ color: '#64748b', fontSize: '0.875rem' }}>Enter your body stats to auto-calculate BMI, BMR, TDEE</div></div>
                        <a href="/profile/setup" style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>Set Up →</a>
                    </div>
                )}

                {/* Macros */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                        { label: 'Carbs', eaten: Math.round(summary.carbs), target: metrics?.macros.carbs || 0, color: '#f59e0b' },
                        { label: 'Fats', eaten: Math.round(summary.fats), target: metrics?.macros.fats || 0, color: '#8b5cf6' },
                        { label: 'Protein', eaten: Math.round(summary.protein), target: metrics?.macros.protein || 0, color: '#06b6d4' },
                    ].map(m => (
                        <div key={m.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{m.label}</span>
                                <span style={{ fontSize: '0.8rem', color: m.color, fontWeight: 600 }}>{m.eaten}g / {m.target}g</span>
                            </div>
                            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 100, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.min(m.target ? (m.eaten / m.target * 100) : 0, 100)}%`, background: m.color, borderRadius: 100 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

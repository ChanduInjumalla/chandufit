'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ExerciseDemo from '@/components/ExerciseDemo';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { weeklySplit, SplitExercise } from '@/data/weeklySplit';

interface Exercise { _id: string; name: string; muscleGroup: string; difficulty: string; equipment: string; }
const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'];
const GROUP_ICONS: Record<string, string> = { Chest: '🏋️', Back: '🔙', Legs: '🦵', Shoulders: '💪', Arms: '🙌', Core: '🎯', Cardio: '🏃', 'Full Body': '⚡' };
const DIFF_COLOR: Record<string, string> = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' };
interface SetEntry { reps: number; weight: number; }
interface LoggedExercise { workoutId: string; workoutName: string; muscleGroup: string; sets: SetEntry[]; }

// Simple form data for exercises in the library
const EXERCISE_TIPS: Record<string, { main: string; secondary: string; variation: string; formTips: string[]; mistakes: string[] }> = {};
// Populate from weeklySplit data
weeklySplit.forEach(day => day.groups.forEach(g => g.exercises.forEach(ex => {
    EXERCISE_TIPS[ex.name.toLowerCase()] = { main: ex.main, secondary: ex.secondary, variation: ex.variation, formTips: ex.formTips, mistakes: ex.mistakes };
})));

export default function WorkoutPage() {
    const router = useRouter();
    const [mainTab, setMainTab] = useState<'library' | 'split'>('library');
    const [activeGroup, setActiveGroup] = useState('Chest');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [todayLog, setTodayLog] = useState<LoggedExercise[]>([]);
    const [workoutDone, setWorkoutDone] = useState(false);
    const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
    const [sets, setSets] = useState<SetEntry[]>([{ reps: 10, weight: 0 }]);
    const [saving, setSaving] = useState(false);
    const [consistency, setConsistency] = useState<any>(null);
    // Demo modal state
    const [demoEx, setDemoEx] = useState<{ name: string; main: string; secondary: string; variation: string; formTips: string[]; mistakes: string[] } | null>(null);
    // Split day selection
    const [selectedDay, setSelectedDay] = useState(0);

    const loadData = useCallback(async () => {
        try {
            const [exRes, logRes, consRes] = await Promise.all([
                api.get(`/workouts?muscleGroup=${activeGroup}`), api.get('/workouts/log/today'), api.get('/workouts/consistency'),
            ]);
            setExercises(exRes.data); setTodayLog(logRes.data?.exercises || []);
            setWorkoutDone(logRes.data?.completedToday || false); setConsistency(consRes.data);
        } catch { router.push('/auth/login'); }
    }, [activeGroup, router]);

    useEffect(() => { const t = localStorage.getItem('chandufit_token'); if (!t) { router.push('/auth/login'); return; } loadData(); }, [loadData, router]);

    const addSet = () => setSets(s => [...s, { reps: 10, weight: 0 }]);
    const updateSet = (i: number, f: 'reps' | 'weight', v: number) => setSets(s => s.map((set, idx) => idx === i ? { ...set, [f]: v } : set));
    const removeSet = (i: number) => setSets(s => s.filter((_, idx) => idx !== i));

    const logExercise = async () => {
        if (!selectedEx) return; setSaving(true);
        try {
            const existing = todayLog.find(e => e.workoutId === selectedEx._id);
            const newLog = existing ? todayLog.map(e => e.workoutId === selectedEx._id ? { ...e, sets } : e) : [...todayLog, { workoutId: selectedEx._id, workoutName: selectedEx.name, muscleGroup: selectedEx.muscleGroup, sets }];
            await api.post('/workouts/log', { exercises: newLog }); toast.success(`${selectedEx.name} logged! 💪`); setSelectedEx(null); setSets([{ reps: 10, weight: 0 }]); loadData();
        } catch { toast.error('Failed'); } setSaving(false);
    };

    const markDone = async () => { try { await api.post('/workouts/log', { exercises: todayLog }); toast.success('Workout complete! 🔥'); loadData(); } catch { toast.error('Error'); } };

    const openDemo = (name: string, customData?: SplitExercise) => {
        if (customData) {
            setDemoEx({ name: customData.name, main: customData.main, secondary: customData.secondary, variation: customData.variation, formTips: customData.formTips, mistakes: customData.mistakes });
        } else {
            const key = name.toLowerCase();
            const tips = EXERCISE_TIPS[key] || { main: 'Target Muscle', secondary: 'Supporting Muscles', variation: '-', formTips: ['Focus on mind-muscle connection', 'Control the negative', 'Full range of motion'], mistakes: ['Using too much weight', 'Poor posture'] };
            setDemoEx({ name, ...tips });
        }
    };

    const inputStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#1e293b', padding: '0.4rem 0.6rem', width: 70, fontSize: '0.85rem' };

    const currentSplit = weeklySplit[selectedDay];

    return (
        <div style={{ minHeight: '100vh', background: '#f8faff', paddingTop: 70 }}>
            <Navbar />
            {demoEx && <ExerciseDemo {...demoEx} onClose={() => setDemoEx(null)} />}

            <div style={{ maxWidth: 1050, margin: '0 auto', padding: '2rem 1.5rem', animation: 'fadeIn 0.5s ease' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>🏋️ Workout</h1>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.5rem 0.9rem', fontSize: '0.85rem', color: '#64748b' }}>
                            Week: <strong style={{ color: '#2563eb' }}>{consistency?.consistency ?? 0}%</strong>
                        </div>
                        {workoutDone ? (
                            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid #10b981', color: '#10b981', borderRadius: 10, padding: '0.5rem 0.9rem', fontSize: '0.85rem', fontWeight: 600 }}>✅ Done Today!</div>
                        ) : (
                            <button onClick={markDone} style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>Mark Done</button>
                        )}
                    </div>
                </div>

                {/* Weekly Consistency Dots */}
                {consistency?.data && (
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '0.75rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>This Week</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {consistency.data.map((d: any, i: number) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: d.completed ? '#10b981' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff' }}>{d.completed ? '✓' : ''}</div>
                                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem' }}>
                    {[
                        { key: 'library', label: '📚 Exercise Library', desc: 'All exercises + demo' },
                        { key: 'split', label: '📋 Weekly Split', desc: '6-day program' },
                    ].map(t => (
                        <button key={t.key} onClick={() => setMainTab(t.key as any)}
                            style={{ flex: 1, padding: '0.9rem 1rem', borderRadius: 12, border: mainTab === t.key ? 'none' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: mainTab === t.key ? 'linear-gradient(135deg, #2563eb, #06b6d4)' : '#fff', color: mainTab === t.key ? '#fff' : '#64748b', boxShadow: mainTab === t.key ? '0 4px 14px rgba(37,99,235,0.25)' : '0 1px 4px rgba(0,0,0,0.02)' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.label}</span>
                            <span style={{ fontSize: '0.72rem', opacity: mainTab === t.key ? 0.85 : 0.7 }}>{t.desc}</span>
                        </button>
                    ))}
                </div>

                {/* ========== EXERCISE LIBRARY TAB ========== */}
                {mainTab === 'library' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.5rem' }}>
                        {/* Muscle Group Sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {MUSCLE_GROUPS.map(g => (
                                <button key={g} onClick={() => setActiveGroup(g)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.55rem 0.85rem', borderRadius: 10, border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', background: activeGroup === g ? 'rgba(37,99,235,0.08)' : 'transparent', color: activeGroup === g ? '#2563eb' : '#64748b', transition: 'all 0.2s' }}>
                                    <span>{GROUP_ICONS[g]}</span> {g}
                                </button>
                            ))}
                        </div>

                        {/* Exercise List */}
                        <div>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#2563eb' }}>{GROUP_ICONS[activeGroup]} {activeGroup} Exercises</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
                                {exercises.map(ex => {
                                    const isLogged = todayLog.some(e => e.workoutId === ex._id);
                                    const isSelected = selectedEx?._id === ex._id;
                                    return (
                                        <div key={ex._id} style={{ background: isSelected ? 'rgba(37,99,235,0.03)' : '#fff', border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s', boxShadow: isSelected ? '0 4px 14px rgba(37,99,235,0.08)' : '0 1px 4px rgba(0,0,0,0.02)' }}>
                                            {/* Exercise Header */}
                                            <div style={{ padding: '0.85rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                onClick={() => { setSelectedEx(isSelected ? null : ex); setSets([{ reps: 10, weight: 0 }]); }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>{ex.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{ex.equipment}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                    <button onClick={e => { e.stopPropagation(); openDemo(ex.name); }}
                                                        style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb', borderRadius: 8, padding: '3px 10px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        🎬 Demo
                                                    </button>
                                                    {isLogged && <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16,185,129,0.08)', border: '1px solid #10b981', borderRadius: 6, padding: '2px 6px' }}>✓ Done</span>}
                                                    <span style={{ fontSize: '0.7rem', color: DIFF_COLOR[ex.difficulty], background: `${DIFF_COLOR[ex.difficulty]}10`, borderRadius: 6, padding: '2px 6px', border: `1px solid ${DIFF_COLOR[ex.difficulty]}25` }}>{ex.difficulty}</span>
                                                </div>
                                            </div>

                                            {/* Set Logger (expanded) */}
                                            {isSelected && (
                                                <div style={{ borderTop: '1px solid #e2e8f0', padding: '1rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>LOG SETS</span>
                                                        <button onClick={addSet} style={{ background: 'transparent', border: '1px solid #2563eb', color: '#2563eb', borderRadius: 6, padding: '2px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Set</button>
                                                    </div>
                                                    {sets.map((s, i) => (
                                                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: 40 }}>Set {i + 1}</span>
                                                            <input type="number" min={1} value={s.reps} onChange={e => updateSet(i, 'reps', Number(e.target.value))} placeholder="Reps" style={inputStyle} />
                                                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>reps</span>
                                                            <input type="number" min={0} step={2.5} value={s.weight} onChange={e => updateSet(i, 'weight', Number(e.target.value))} placeholder="kg" style={inputStyle} />
                                                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>kg</span>
                                                            {sets.length > 1 && <button onClick={() => removeSet(i)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>}
                                                        </div>
                                                    ))}
                                                    <button onClick={logExercise} disabled={saving}
                                                        style={{ marginTop: 4, width: '100%', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                                                        {saving ? 'Saving...' : 'Log Exercise 💪'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Today's Logged */}
                            {todayLog.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#10b981' }}>✅ Logged Today</h3>
                                    {todayLog.map((e, i) => (
                                        <div key={i} style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: 8 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', marginBottom: 4 }}>{e.workoutName}</div>
                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                {(e.sets || []).map((s, j) => (
                                                    <span key={j} style={{ fontSize: '0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 8px', color: '#64748b' }}>{s.reps} × {s.weight}kg</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========== WEEKLY SPLIT TAB ========== */}
                {mainTab === 'split' && (
                    <div>
                        {/* Day Selector */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: '1.5rem' }}>
                            {weeklySplit.map((day, i) => (
                                <button key={i} onClick={() => setSelectedDay(i)}
                                    style={{ padding: '0.65rem 0.4rem', borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', border: selectedDay === i ? `2px solid ${day.color}` : '1px solid #e2e8f0', background: selectedDay === i ? `${day.color}08` : '#fff', boxShadow: selectedDay === i ? `0 4px 14px ${day.color}15` : 'none' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedDay === i ? day.color : '#94a3b8' }}>{day.icon}</div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: selectedDay === i ? '#0f172a' : '#94a3b8', marginTop: 2 }}>Day {day.day}</div>
                                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>{day.title.split(' + ')[0]}</div>
                                </button>
                            ))}
                            {/* Day 7 - Rest */}
                            <div style={{ padding: '0.65rem 0.4rem', borderRadius: 10, textAlign: 'center', border: '1px solid #e2e8f0', background: '#f8faff', opacity: 0.6 }}>
                                <div style={{ fontSize: '0.85rem' }}>😴</div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', marginTop: 2 }}>Day 7</div>
                                <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: 2 }}>REST</div>
                            </div>
                        </div>

                        {/* Day Header */}
                        <div style={{ background: `linear-gradient(135deg, ${currentSplit.color}, ${currentSplit.color}cc)`, borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', color: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: 500 }}>DAY {currentSplit.day}</div>
                                    <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: 4 }}>{currentSplit.title}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>{currentSplit.groups.reduce((s, g) => s + g.exercises.length, 0)}</div>
                                    <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>exercises</div>
                                </div>
                            </div>
                        </div>

                        {/* Exercise Groups */}
                        {currentSplit.groups.map((group, gi) => (
                            <div key={gi} style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                                    <div style={{ width: 4, height: 24, borderRadius: 4, background: group.color }} />
                                    <h2 style={{ fontSize: '1rem', fontWeight: 800, color: group.color }}>{group.name}</h2>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{group.exercises.length} exercises</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {group.exercises.map((ex, ei) => (
                                        <div key={ei} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
                                            <div style={{ padding: '1rem 1.15rem' }}>
                                                {/* Exercise number + name */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${group.color}12`, border: `1px solid ${group.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: group.color, flexShrink: 0 }}>
                                                            {gi > 0 ? group.exercises.length - group.exercises.length + ei + 1 + currentSplit.groups.slice(0, gi).reduce((s, g) => s + g.exercises.length, 0) : ei + 1}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{ex.name}</div>
                                                            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                                                                <span style={{ background: 'rgba(37,99,235,0.06)', color: '#2563eb', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600 }}>Main: {ex.main}</span>
                                                                <span style={{ background: 'rgba(100,116,139,0.06)', color: '#64748b', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600 }}>Sec: {ex.secondary}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => openDemo(ex.name, ex)}
                                                        style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, boxShadow: '0 2px 8px rgba(37,99,235,0.2)' }}>
                                                        🎬 Demo
                                                    </button>
                                                </div>

                                                {/* Sets/Reps + Variation */}
                                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                                                    <div style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 10px', fontSize: '0.75rem', color: '#0f172a' }}>
                                                        <strong>{ex.sets}</strong> sets × <strong>{ex.reps}</strong> reps
                                                    </div>
                                                    <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, padding: '4px 10px', fontSize: '0.75rem', color: '#92400e' }}>
                                                        💡 Alt: {ex.variation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Weekly Structure Summary */}
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 12px rgba(37,99,235,0.04)' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#2563eb' }}>📋 Weekly Structure</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                                {weeklySplit.map((day, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8faff', cursor: 'pointer' }} onClick={() => setSelectedDay(i)}>
                                        <span>{day.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Day {day.day}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{day.title}</div>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8faff' }}>
                                    <span>😴</span>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Day 7</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Rest & Recovery</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {['✔ Chest 2x/week', '✔ Back 2x/week', '✔ Arms 2x/week', '✔ Legs 1 heavy day', '✔ Shoulders direct', '✔ Abs direct'].map(note => (
                                    <span key={note} style={{ background: 'rgba(16,185,129,0.06)', color: '#10b981', padding: '4px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600 }}>{note}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

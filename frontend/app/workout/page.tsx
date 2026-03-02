'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Exercise { _id: string; name: string; muscleGroup: string; difficulty: string; equipment: string; }
const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Full Body'];
const GROUP_ICONS: Record<string, string> = { Chest: '🏋️', Back: '🔙', Legs: '🦵', Shoulders: '💪', Arms: '🙌', Core: '🎯', Cardio: '🏃', 'Full Body': '⚡' };
const DIFF_COLOR: Record<string, string> = { Beginner: '#4ade80', Intermediate: '#facc15', Advanced: '#E63946' };

interface SetEntry { reps: number; weight: number; }
interface LoggedExercise { workoutId: string; workoutName: string; muscleGroup: string; sets: SetEntry[]; }

export default function WorkoutPage() {
    const router = useRouter();
    const [activeGroup, setActiveGroup] = useState('Chest');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [todayLog, setTodayLog] = useState<LoggedExercise[]>([]);
    const [workoutDone, setWorkoutDone] = useState(false);
    const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
    const [sets, setSets] = useState<SetEntry[]>([{ reps: 10, weight: 0 }]);
    const [saving, setSaving] = useState(false);
    const [consistency, setConsistency] = useState<any>(null);

    const loadData = useCallback(async () => {
        try {
            const [exRes, logRes, consRes] = await Promise.all([
                api.get(`/workouts?muscleGroup=${activeGroup}`),
                api.get('/workouts/log/today'),
                api.get('/workouts/consistency'),
            ]);
            setExercises(exRes.data);
            setTodayLog(logRes.data?.exercises || []);
            setWorkoutDone(logRes.data?.completedToday || false);
            setConsistency(consRes.data);
        } catch { router.push('/auth/login'); }
    }, [activeGroup, router]);

    useEffect(() => {
        const token = localStorage.getItem('chandufit_token');
        if (!token) { router.push('/auth/login'); return; }
        loadData();
    }, [loadData, router]);

    const addSet = () => setSets(s => [...s, { reps: 10, weight: 0 }]);
    const updateSet = (i: number, field: 'reps' | 'weight', val: number) => {
        setSets(s => s.map((set, idx) => idx === i ? { ...set, [field]: val } : set));
    };
    const removeSet = (i: number) => setSets(s => s.filter((_, idx) => idx !== i));

    const logExercise = async () => {
        if (!selectedEx) return;
        setSaving(true);
        try {
            const existing = todayLog.find(e => e.workoutId === selectedEx._id);
            let newLog: LoggedExercise[];
            if (existing) {
                newLog = todayLog.map(e => e.workoutId === selectedEx._id ? { ...e, sets } : e);
            } else {
                newLog = [...todayLog, { workoutId: selectedEx._id, workoutName: selectedEx.name, muscleGroup: selectedEx.muscleGroup, sets }];
            }
            await api.post('/workouts/log', { exercises: newLog });
            toast.success(`${selectedEx.name} logged! 💪`);
            setSelectedEx(null); setSets([{ reps: 10, weight: 0 }]);
            loadData();
        } catch { toast.error('Failed to log'); }
        setSaving(false);
    };

    const markDone = async () => {
        try {
            await api.post('/workouts/log', { exercises: todayLog });
            toast.success('Workout marked complete! 🔥');
            loadData();
        } catch { toast.error('Error'); }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0D0D0D', paddingTop: 70 }}>
            <Navbar />
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>🏋️ Workout Planner</h1>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                            Week: <strong style={{ color: '#FF6B35' }}>{consistency?.consistency ?? 0}%</strong> consistent
                        </div>
                        {workoutDone ? (
                            <div style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid #4ade80', color: '#4ade80', borderRadius: 8, padding: '0.5rem 0.9rem', fontSize: '0.85rem', fontWeight: 600 }}>✅ Done Today!</div>
                        ) : (
                            <button onClick={markDone} style={{ background: 'linear-gradient(135deg,#FF6B35,#E63946)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                                Mark Workout Done
                            </button>
                        )}
                    </div>
                </div>

                {/* Weekly consistency dots */}
                {consistency?.data && (
                    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 8 }}>This Week</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {consistency.data.map((d: any, i: number) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: d.completed ? '#4ade80' : '#2A2A2A', border: `2px solid ${d.completed ? '#4ade80' : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                        {d.completed ? '✓' : ''}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#555' }}>
                                        {new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem' }}>
                    {/* Muscle Group Tabs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {MUSCLE_GROUPS.map(g => (
                            <button key={g} onClick={() => setActiveGroup(g)}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 0.9rem', borderRadius: 8, border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', background: activeGroup === g ? 'rgba(255,107,53,0.15)' : 'transparent', color: activeGroup === g ? '#FF6B35' : '#888', transition: 'all 0.2s' }}>
                                <span>{GROUP_ICONS[g]}</span> {g}
                            </button>
                        ))}
                    </div>

                    {/* Exercise List + Logger */}
                    <div>
                        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#FF6B35' }}>
                            {GROUP_ICONS[activeGroup]} {activeGroup} Exercises
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
                            {exercises.map(ex => {
                                const isLogged = todayLog.some(e => e.workoutId === ex._id);
                                const isSelected = selectedEx?._id === ex._id;
                                return (
                                    <button key={ex._id} onClick={() => { setSelectedEx(isSelected ? null : ex); setSets([{ reps: 10, weight: 0 }]); }}
                                        style={{ background: isSelected ? 'rgba(255,107,53,0.12)' : '#1A1A1A', border: `1px solid ${isSelected ? '#FF6B35' : '#2A2A2A'}`, borderRadius: 10, padding: '0.85rem 1rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#F0F0F0', marginBottom: 2 }}>{ex.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{ex.equipment}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                {isLogged && <span style={{ fontSize: '0.7rem', color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid #4ade80', borderRadius: 6, padding: '2px 6px' }}>✓ Done</span>}
                                                <span style={{ fontSize: '0.7rem', color: DIFF_COLOR[ex.difficulty], background: `rgba(0,0,0,0.4)`, borderRadius: 6, padding: '2px 6px', border: `1px solid ${DIFF_COLOR[ex.difficulty]}33` }}>{ex.difficulty}</span>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div style={{ marginTop: '1rem', borderTop: '1px solid #2A2A2A', paddingTop: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888' }}>SETS</span>
                                                    <button onClick={(e) => { e.stopPropagation(); addSet(); }} style={{ background: 'transparent', border: '1px solid #FF6B35', color: '#FF6B35', borderRadius: 6, padding: '2px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Set</button>
                                                </div>
                                                {sets.map((s, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.75rem', color: '#555', width: 40 }}>Set {i + 1}</span>
                                                        <input type="number" min={1} value={s.reps} onClick={e => e.stopPropagation()}
                                                            onChange={e => updateSet(i, 'reps', Number(e.target.value))}
                                                            placeholder="Reps"
                                                            style={{ background: '#111', border: '1px solid #333', borderRadius: 6, color: '#F0F0F0', padding: '0.4rem 0.6rem', width: 70, fontSize: '0.85rem' }} />
                                                        <span style={{ color: '#555', fontSize: '0.75rem' }}>reps</span>
                                                        <input type="number" min={0} step={2.5} value={s.weight} onClick={e => e.stopPropagation()}
                                                            onChange={e => updateSet(i, 'weight', Number(e.target.value))}
                                                            placeholder="kg"
                                                            style={{ background: '#111', border: '1px solid #333', borderRadius: 6, color: '#F0F0F0', padding: '0.4rem 0.6rem', width: 70, fontSize: '0.85rem' }} />
                                                        <span style={{ color: '#555', fontSize: '0.75rem' }}>kg</span>
                                                        {sets.length > 1 && <button onClick={(e) => { e.stopPropagation(); removeSet(i); }} style={{ background: 'transparent', border: 'none', color: '#E63946', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>}
                                                    </div>
                                                ))}
                                                <button onClick={(e) => { e.stopPropagation(); logExercise(); }} disabled={saving}
                                                    style={{ marginTop: 4, width: '100%', background: 'linear-gradient(135deg,#FF6B35,#E63946)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: '0.875rem' }}>
                                                    {saving ? 'Saving...' : 'Log Exercise 💪'}
                                                </button>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Today's logged exercises */}
                        {todayLog.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#4ade80' }}>✅ Logged Today</h3>
                                {todayLog.map((e, i) => (
                                    <div key={i} style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: 8 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>{e.workoutName}</div>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            {(e.sets || []).map((s, j) => (
                                                <span key={j} style={{ fontSize: '0.75rem', background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 6, padding: '2px 8px', color: '#aaa' }}>
                                                    {s.reps} × {s.weight}kg
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

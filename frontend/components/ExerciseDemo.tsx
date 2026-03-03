'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ExerciseDemoProps {
    name: string;
    main: string;
    secondary: string;
    variation: string;
    formTips?: string[];
    mistakes?: string[];
    onClose: () => void;
}

// Curated YouTube video IDs for each exercise — teaching proper form
const EXERCISE_VIDEOS: Record<string, string> = {
    // CHEST
    'barbell bench press': 'rT7DgCr-3pg',
    'incline dumbbell press': '8iPEnn-ltC8',
    'incline barbell bench press': 'SrqOu55lrYU',
    'flat dumbbell press': 'VmB1G1K7v94',
    'cable chest fly': 'Iwe6AmxVf7o',
    'pec deck fly': 'Iwe6AmxVf7o',
    'machine chest press': 'rT7DgCr-3pg',
    'decline push-ups': 'SKPab2YC8BE',

    // BACK
    'lat pulldown (wide grip)': 'CAwf7n6Luuc',
    'lat pulldown': 'CAwf7n6Luuc',
    'close grip lat pulldown': 'ecRF8ERf2q4',
    'barbell row': 'FWJR5Ve8bnQ',
    'seated cable row': 'GZbfZ033f74',
    'straight arm pulldown': 'lueEJGjTuPQ',
    't-bar row': 'j3Igk5nyZE4',
    'single arm dumbbell row': 'pYcpY20QaE8',
    'wide grip pull-ups': 'eGo4IYlbE5g',

    // LEGS
    'barbell squat': 'ultWZbUMPL8',
    'leg press': 'IZxyjW7MPJQ',
    'romanian deadlift': 'WJm9zA2NY8E',
    'walking lunges': 'K-CrEi0ymMg',
    'leg curl': '1Tq3QdYUuHs',
    'standing calf raise': 'gwLzBJYoWlI',

    // SHOULDERS
    'seated db press': '2pLT-olgUJs',
    'lateral raises': 'kDqklk1ZESo',
    'rear delt fly': 'YA-h3n9L4YU',
    'upright row': 'amCU-ziHITM',

    // TRICEPS
    'rope pushdown': '2-LAMcpzODU',
    'overhead db extension': '_gsUck-7M74',
    'bench dips': '4AObAU-EcYE',
    'close grip bench press': 'nEF0bv2FW94',
    'ez bar skull crushers': 'd_KZxkY_0cM',
    'cable tricep kickbacks': '6SS6K3lAwZ8',

    // BICEPS
    'barbell curl': 'CFBZ4jN1CMI',
    'incline db curl': 'soxrZlIl35U',
    'hammer curl': '0cXAp6WhSj4',
    'preacher curl': 'fIWP-FRFNU0',
    'concentration curl': '0AUGkch3tzc',
    'reverse barbell curl': 'nRgxYX2Ve9w',

    // ABS / CORE
    'hanging leg raise': 'gRVjAtPip0Y',
    'cable crunch': 'av7-8igSXTs',
    'plank': 'ASdvN_XEl_c',

    // FOREARMS
    'barbell wrist curls': 'CFBZ4jN1CMI',
};

// Find the best matching video for an exercise
const getVideoId = (name: string): string => {
    const n = name.toLowerCase();

    // Direct match
    if (EXERCISE_VIDEOS[n]) return EXERCISE_VIDEOS[n];

    // Partial matches
    for (const [key, id] of Object.entries(EXERCISE_VIDEOS)) {
        if (n.includes(key) || key.includes(n)) return id;
    }

    // Category fallbacks
    if (n.includes('bench') || n.includes('chest press')) return EXERCISE_VIDEOS['barbell bench press'];
    if (n.includes('incline') && n.includes('press')) return EXERCISE_VIDEOS['incline dumbbell press'];
    if (n.includes('fly') || n.includes('crossover') || n.includes('pec')) return EXERCISE_VIDEOS['cable chest fly'];
    if (n.includes('pulldown') || n.includes('lat pull')) return EXERCISE_VIDEOS['lat pulldown'];
    if (n.includes('pull-up') || n.includes('pullup') || n.includes('chin')) return EXERCISE_VIDEOS['wide grip pull-ups'];
    if (n.includes('row') && !n.includes('upright')) return EXERCISE_VIDEOS['barbell row'];
    if (n.includes('squat') || n.includes('hack')) return EXERCISE_VIDEOS['barbell squat'];
    if (n.includes('deadlift') || n.includes('rdl')) return EXERCISE_VIDEOS['romanian deadlift'];
    if (n.includes('leg press')) return EXERCISE_VIDEOS['leg press'];
    if (n.includes('lunge') || n.includes('split')) return EXERCISE_VIDEOS['walking lunges'];
    if (n.includes('calf')) return EXERCISE_VIDEOS['standing calf raise'];
    if (n.includes('curl') && !n.includes('wrist') && !n.includes('leg')) return EXERCISE_VIDEOS['barbell curl'];
    if (n.includes('pushdown') || n.includes('push down') || n.includes('kickback')) return EXERCISE_VIDEOS['rope pushdown'];
    if (n.includes('extension') || n.includes('skull')) return EXERCISE_VIDEOS['overhead db extension'];
    if (n.includes('dip')) return EXERCISE_VIDEOS['bench dips'];
    if (n.includes('shoulder') || n.includes('overhead') || n.includes('military')) return EXERCISE_VIDEOS['seated db press'];
    if (n.includes('lateral') || n.includes('side delt')) return EXERCISE_VIDEOS['lateral raises'];
    if (n.includes('rear delt') || n.includes('face pull')) return EXERCISE_VIDEOS['rear delt fly'];
    if (n.includes('plank') || n.includes('crunch') || n.includes('leg raise') || n.includes('abs')) return EXERCISE_VIDEOS['plank'];
    if (n.includes('wrist') || n.includes('forearm')) return EXERCISE_VIDEOS['barbell wrist curls'];
    if (n.includes('hammer')) return EXERCISE_VIDEOS['hammer curl'];

    return EXERCISE_VIDEOS['barbell bench press']; // ultimate fallback
};

// Map exercise to 3D image
const getExerciseImage = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('bench press') && !n.includes('incline') && !n.includes('decline')) return '/exercises/bench-press.png';
    if (n.includes('incline') && n.includes('press')) return '/exercises/incline-press.png';
    if (n.includes('fly') || n.includes('pec deck') || n.includes('crossover') || n.includes('cable chest')) return '/exercises/cable-fly.png';
    if (n.includes('pulldown') || n.includes('lat pull')) return '/exercises/lat-pulldown.png';
    if (n.includes('pull-up') || n.includes('pullup') || n.includes('chin')) return '/exercises/pullups.png';
    if (n.includes('row') && !n.includes('upright')) return '/exercises/barbell-row.png';
    if (n.includes('squat') || n.includes('hack')) return '/exercises/squat.png';
    if (n.includes('leg press')) return '/exercises/leg-press.png';
    if (n.includes('deadlift') || n.includes('rdl')) return '/exercises/deadlift.png';
    if (n.includes('lunge') || n.includes('split')) return '/exercises/lunges.png';
    if (n.includes('curl') && !n.includes('wrist') && !n.includes('leg')) return '/exercises/bicep-curl.png';
    if (n.includes('pushdown') || n.includes('kickback') || n.includes('extension') || n.includes('skull')) return '/exercises/tricep-pushdown.png';
    if (n.includes('dip') || n.includes('push-up')) return '/exercises/dips.png';
    if (n.includes('shoulder') || n.includes('db press') || n.includes('overhead') && !n.includes('extension')) return '/exercises/shoulder-press.png';
    if (n.includes('lateral') || n.includes('raise') || n.includes('rear delt') || n.includes('upright')) return '/exercises/lateral-raise.png';
    return '/exercises/bench-press.png';
};

export default function ExerciseDemo({ name, main, secondary, variation, formTips = [], mistakes = [], onClose }: ExerciseDemoProps) {
    const [activeTab, setActiveTab] = useState<'video' | 'form' | 'mistakes'>('video');
    const videoId = getVideoId(name);
    const imgSrc = getExerciseImage(name);

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }} />
            <div style={{ position: 'relative', width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', background: '#fff', borderRadius: 20, boxShadow: '0 25px 80px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ padding: '1.25rem 1.5rem 1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{name}</h2>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb', padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600 }}>🎯 {main}</span>
                            <span style={{ background: 'rgba(100,116,139,0.08)', color: '#64748b', padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600 }}>⚡ {secondary}</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: '1.2rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, padding: '0.75rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    {[
                        { key: 'video', label: '🎬 Video Demo', color: '#ef4444' },
                        { key: 'form', label: '✅ Form Guide', color: '#10b981' },
                        { key: 'mistakes', label: '❌ Mistakes', color: '#ef4444' },
                    ].map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                            style={{ padding: '0.45rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', background: activeTab === t.key ? `${t.color}10` : 'transparent', color: activeTab === t.key ? t.color : '#94a3b8', transition: 'all 0.2s' }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem 1.5rem' }}>

                    {/* VIDEO TAB */}
                    {activeTab === 'video' && (
                        <div>
                            {/* Embedded YouTube Video */}
                            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: 14, overflow: 'hidden', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                    title={`${name} - Proper Form Tutorial`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: 14 }}
                                />
                            </div>

                            {/* Info below video */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: '0.75rem' }}>
                                <div style={{ flex: 1, background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.6rem 0.75rem' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>🎯 Main Target</div>
                                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', marginTop: 2 }}>{main}</div>
                                </div>
                                <div style={{ flex: 1, background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.6rem 0.75rem' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>⚡ Secondary</div>
                                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', marginTop: 2 }}>{secondary}</div>
                                </div>
                            </div>

                            {/* Alternative */}
                            {variation && (
                                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '0.7rem 1rem', display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.2rem' }}>💡</span>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Alternative Exercise</div>
                                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{variation}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* FORM GUIDE TAB */}
                    {activeTab === 'form' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {/* 3D Image preview */}
                            <div style={{ position: 'relative', width: '100%', height: 140, borderRadius: 12, overflow: 'hidden', marginBottom: 4, border: '1px solid #e2e8f0' }}>
                                <Image src={imgSrc} alt={name} fill style={{ objectFit: 'cover' }} unoptimized />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', display: 'flex', alignItems: 'flex-end', padding: 12 }}>
                                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>✅ {name} — Proper Form</span>
                                </div>
                            </div>

                            {formTips.length > 0 ? formTips.map((tip, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 10, padding: '0.7rem 1rem' }}>
                                    <div style={{ width: 24, height: 24, borderRadius: 8, background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                                    <span style={{ color: '#1e293b', fontSize: '0.875rem', lineHeight: 1.5 }}>{tip}</span>
                                </div>
                            )) : <div style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '1rem', textAlign: 'center' }}>Focus on mind-muscle connection and control the negative.</div>}
                        </div>
                    )}

                    {/* MISTAKES TAB */}
                    {activeTab === 'mistakes' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {/* 3D Image with warning */}
                            <div style={{ position: 'relative', width: '100%', height: 140, borderRadius: 12, overflow: 'hidden', marginBottom: 4, border: '1px solid #e2e8f0' }}>
                                <Image src={imgSrc} alt={name} fill style={{ objectFit: 'cover', filter: 'brightness(0.4)' }} unoptimized />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ background: 'rgba(239,68,68,0.9)', color: '#fff', padding: '8px 20px', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem' }}>❌ Common Mistakes to Avoid</span>
                                </div>
                            </div>

                            {mistakes.length > 0 ? mistakes.map((m, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 10, padding: '0.7rem 1rem' }}>
                                    <span style={{ color: '#ef4444', fontSize: '1.1rem', flexShrink: 0, lineHeight: 1 }}>⚠️</span>
                                    <span style={{ color: '#1e293b', fontSize: '0.875rem', lineHeight: 1.5 }}>{m}</span>
                                </div>
                            )) : <div style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '1rem', textAlign: 'center' }}>Avoid using too much weight and maintain proper posture.</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

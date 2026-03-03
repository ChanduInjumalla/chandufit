'use client';
import Link from 'next/link';

export default function Home() {
    return (
        <div style={{ minHeight: '100vh', background: '#f8faff' }}>
            {/* Navbar */}
            <nav style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 2rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>FT</div>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>FitTracker</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Link href="/auth/login" style={{ padding: '0.55rem 1.4rem', borderRadius: 10, border: '1px solid #e2e8f0', color: '#2563eb', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', background: '#fff' }}>
                        Log In
                    </Link>
                    <Link href="/auth/signup" style={{ padding: '0.55rem 1.4rem', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section style={{
                position: 'relative', padding: '5rem 2rem 4rem', textAlign: 'center', overflow: 'hidden',
                background: 'linear-gradient(180deg, #eff6ff 0%, #f8faff 50%, #ecfeff 100%)',
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
                <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', animation: 'slideUp 0.7s ease' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(37,99,235,0.08)', color: '#2563eb', borderRadius: 100, padding: '0.4rem 1.2rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(37,99,235,0.15)' }}>
                        🏋️ Your AI-Powered Fitness Companion
                    </div>
                    <h1 style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1.15, color: '#0f172a', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
                        Your Personal<br />
                        <span style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Fitness Tracker
                        </span>
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: 520, margin: '0 auto 2rem', lineHeight: 1.7 }}>
                        Track your calories, plan your workouts, monitor macros, and build discipline — all in one beautiful platform.
                    </p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/auth/signup" style={{ padding: '0.85rem 2.2rem', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', boxShadow: '0 6px 24px rgba(37,99,235,0.35)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            Start Free Today <span>→</span>
                        </Link>
                        <Link href="/auth/login" style={{ padding: '0.85rem 2rem', borderRadius: 12, border: '1px solid #e2e8f0', color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            Log In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '4rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', color: '#0f172a', marginBottom: '0.75rem' }}>Everything You Need</h2>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '3rem', fontSize: '1.05rem' }}>Smart tools to transform your fitness journey</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { icon: '📊', title: 'Body Metrics', desc: 'Auto-calculate BMI, BMR, TDEE, body fat, and get personalized calorie & macro targets', color: '#2563eb' },
                        { icon: '🍛', title: 'Smart Diet Planner', desc: 'Search 100+ foods (Indian, International, Telugu names), log meals, generate AI diet plans', color: '#06b6d4' },
                        { icon: '🏋️', title: 'Workout Tracker', desc: 'Browse 66+ exercises by muscle group. Log sets, reps, and weight. Track weekly consistency', color: '#8b5cf6' },
                        { icon: '📈', title: 'Weekly Reports', desc: 'Beautiful Chart.js graphs showing calories, protein, weight progress, and workout consistency', color: '#10b981' },
                        { icon: '🚨', title: 'Discipline System', desc: 'Accountability engine with score, violations, and punishment suggestions. No excuses!', color: '#ef4444' },
                        { icon: '🌍', title: 'World Food Database', desc: '112+ foods with calories, protein, carbs, fats per 100g. Telugu food names included!', color: '#f59e0b' },
                    ].map(f => (
                        <div key={f.title} style={{
                            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '2rem 1.75rem',
                            transition: 'all 0.25s ease', cursor: 'default', position: 'relative', overflow: 'hidden',
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(37,99,235,0.1)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{f.title}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.65 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', padding: '3.5rem 2rem', color: '#fff' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
                    {[
                        { num: '112+', label: 'Foods in Database' },
                        { num: '66+', label: 'Exercises' },
                        { num: '100%', label: 'Free to Use' },
                        { num: '24/7', label: 'Tracking' },
                    ].map(s => (
                        <div key={s.label}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 4 }}>{s.num}</div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.85, fontWeight: 500 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '4rem 2rem', textAlign: 'center', backgroundImage: 'url(/fitness-pattern.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', maxWidth: 620, margin: '0 auto', padding: '3rem', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(37,99,235,0.08)' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Ready to Transform?</h2>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '1rem' }}>Start tracking your fitness journey today. No credit card required.</p>
                    <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.85rem 2.5rem', borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', boxShadow: '0 6px 24px rgba(37,99,235,0.3)' }}>
                        Get Started Free 🚀
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>© 2026 FitTracker — Your Personal Fitness Companion</p>
            </footer>
        </div>
    );
}

'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const stats = [
    { label: 'Foods in Database', value: '100+' },
    { label: 'Workouts', value: '70+' },
    { label: 'Calculations', value: '5' },
    { label: 'Discipline Score', value: '100' },
];

const features = [
    { icon: '🧮', title: 'Smart Body Metrics', desc: 'Auto BMI, BMR, TDEE, Macros calculated instantly' },
    { icon: '🍛', title: 'World Food Database', desc: 'Indian, International & Telugu foods with full macros' },
    { icon: '🏋️', title: 'Workout Planner', desc: '70+ exercises across all muscle groups, track sets & reps' },
    { icon: '📊', title: 'Progress Reports', desc: 'Weekly charts for weight, calories, protein & consistency' },
    { icon: '🔥', title: 'Smart Diet Generator', desc: 'AI-powered meal plans based on your goal & budget' },
    { icon: '🚨', title: 'Discipline System', desc: 'Score system — miss workout, get punished. Stay disciplined.' },
];

export default function HomePage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <div style={{ background: '#0D0D0D', minHeight: '100vh', color: '#F0F0F0' }}>
            {/* Nav */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '1rem 2rem',
                background: scrolled ? 'rgba(13,13,13,0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid #2A2A2A' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.3s'
            }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    <span style={{ background: 'linear-gradient(135deg, #FF6B35, #E63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ChanduFit
                    </span>
                    <span style={{ color: '#888', fontSize: '0.8rem', marginLeft: 6, fontWeight: 400 }}>Global</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/auth/login"
                        style={{ color: '#888', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #2A2A2A', transition: 'all 0.2s' }}>
                        Login
                    </Link>
                    <Link href="/auth/signup"
                        style={{ background: 'linear-gradient(135deg, #FF6B35, #E63946)', color: '#fff', textDecoration: 'none', padding: '0.5rem 1.25rem', borderRadius: 8, fontWeight: 600 }}>
                        Start Free
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '6rem 1.5rem 4rem',
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,53,0.15), transparent)'
            }}>
                <div style={{ fontSize: '0.8rem', color: '#FF6B35', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>
                    🔥 Personal Fitness Platform
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: 800 }}>
                    Track Your{' '}
                    <span style={{ background: 'linear-gradient(135deg, #FF6B35, #E63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Discipline
                    </span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: 600, lineHeight: 1.6, marginBottom: '2.5rem' }}>
                    Auto-calculate your calories, track every meal, log every rep. Your AI-powered fitness companion for real results.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link href="/auth/signup" style={{
                        background: 'linear-gradient(135deg, #FF6B35, #E63946)', color: '#fff', textDecoration: 'none',
                        padding: '1rem 2.5rem', borderRadius: 10, fontWeight: 700, fontSize: '1.05rem', display: 'inline-block'
                    }}>Start Today →</Link>
                    <Link href="/auth/login" style={{
                        color: '#F0F0F0', textDecoration: 'none', padding: '1rem 2.5rem', borderRadius: 10,
                        fontWeight: 500, fontSize: '1.05rem', border: '1px solid #2A2A2A', display: 'inline-block'
                    }}>Login</Link>
                </div>

                {/* Stats Strip */}
                <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {stats.map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg,#FF6B35,#E63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 4 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: '5rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                    Everything You Need
                </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>Built for Chandu. Made for discipline.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {features.map(f => (
                        <div key={f.title} style={{
                            background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12,
                            padding: '1.75rem', transition: 'border-color 0.3s',
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                <div style={{
                    maxWidth: 700, margin: '0 auto', background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(230,57,70,0.1))',
                    border: '1px solid rgba(255,107,53,0.3)', borderRadius: 20, padding: '3rem 2rem'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💣</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Real Talk, Chandu</h2>
                    <p style={{ color: '#888', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.6 }}>
                        If you build this completely, you won't just lose fat. You'll level up mentally. You are 22. This is the perfect age.
                    </p>
                    <Link href="/auth/signup" style={{
                        background: 'linear-gradient(135deg, #FF6B35, #E63946)', color: '#fff', textDecoration: 'none',
                        padding: '1rem 2.5rem', borderRadius: 10, fontWeight: 700, display: 'inline-block'
                    }}>
                        Start Your Journey 🔥
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '2rem', textAlign: 'center', color: '#444', borderTop: '1px solid #1A1A1A', fontSize: '0.85rem' }}>
                ChanduFit Global © 2024 · Built by Chandu · For Discipline
            </footer>
        </div>
    );
}

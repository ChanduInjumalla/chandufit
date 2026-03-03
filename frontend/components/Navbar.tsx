'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/diet', label: 'Diet', icon: '🍛' },
    { href: '/workout', label: 'Workout', icon: '🏋️' },
    { href: '/reports', label: 'Reports', icon: '📈' },
    { href: '/discipline', label: 'Discipline', icon: '🚨' },
    { href: '/profile', label: 'Profile', icon: '🧍' },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem('chandufit_token');
        localStorage.removeItem('chandufit_user');
        router.push('/');
    };

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
            borderBottom: '1px solid #e2e8f0', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            padding: '0 1.5rem', height: 60,
            boxShadow: '0 1px 8px rgba(37,99,235,0.04)',
        }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #2563eb, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.75rem' }}>FT</div>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>FitTracker</span>
            </Link>

            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {navItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} style={{
                            display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
                            padding: '0.45rem 0.85rem', borderRadius: 10, fontSize: '0.84rem', fontWeight: 500,
                            color: isActive ? '#2563eb' : '#64748b',
                            background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                            transition: 'all 0.2s', whiteSpace: 'nowrap',
                        }}>
                            <span style={{ fontSize: '0.95rem' }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
                <button onClick={logout} style={{
                    marginLeft: 8, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b',
                    padding: '0.4rem 0.85rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem',
                    transition: 'all 0.2s', fontWeight: 500,
                }}>Logout</button>
            </div>
        </nav>
    );
}

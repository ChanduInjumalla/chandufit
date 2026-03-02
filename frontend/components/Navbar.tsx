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
            background: 'rgba(13,13,13,0.97)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #2A2A2A', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            padding: '0 1.5rem', height: 60,
        }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, background: 'linear-gradient(135deg, #FF6B35, #E63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ChanduFit
                </span>
            </Link>

            <div style={{ display: 'flex', gap: 4, alignItems: 'center', overflowX: 'auto' }}>
                {navItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} style={{
                            display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
                            padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.835rem', fontWeight: 500,
                            color: isActive ? '#FF6B35' : '#888',
                            background: isActive ? 'rgba(255,107,53,0.1)' : 'transparent',
                            transition: 'all 0.2s', whiteSpace: 'nowrap',
                        }}>
                            <span>{item.icon}</span>
                            <span style={{ display: 'none', '@media(min-width:640px)': { display: 'block' } } as any}>{item.label}</span>
                        </Link>
                    );
                })}
                <button onClick={logout} style={{
                    marginLeft: 8, background: 'transparent', border: '1px solid #2A2A2A', color: '#666',
                    padding: '0.4rem 0.75rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem',
                    transition: 'border-color 0.2s', fontWeight: 500,
                }}>Logout</button>
            </div>
        </nav>
    );
}

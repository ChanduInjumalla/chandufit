'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import api from '@/services/api';

interface Message {
    role: 'user' | 'ai';
    text: string;
    planData?: any;
}

export default function FitnessChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);
    useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);

    // Show welcome message on first open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'ai',
                text: "Hey there! 💪 I'm your FitCoach AI — your personal fitness and nutrition expert.\n\nI can help you with:\n🏋️ Workout plans & exercise form\n🥗 Diet plans (Indian food focused)\n📊 Calorie & macro calculations\n🎯 Personalized fitness guidance\n\nWhat's your fitness goal right now? Are you looking to lose fat, build muscle, or maintain your current shape?"
            }]);
        }
    }, [isOpen, messages.length]);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const { data } = await api.post('/chat', { message: userMsg });
            setMessages(prev => [...prev, {
                role: 'ai',
                text: data.reply,
                planData: data.planData || null,
            }]);
        } catch (err: any) {
            const errMsg = err?.response?.data?.message || 'Oops! Something went wrong. Try again.';
            setMessages(prev => [...prev, { role: 'ai', text: `⚠️ ${errMsg}` }]);
        }
        setLoading(false);
    }, [input, loading]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const applyPlan = async (planData: any) => {
        setApplying(true);
        try {
            // Update user profile with the AI-suggested plan
            const stored = JSON.parse(localStorage.getItem('chandufit_user') || '{}');
            stored.budget = planData.budget || stored.budget;
            stored.goal = planData.goal || stored.goal;
            localStorage.setItem('chandufit_user', JSON.stringify(stored));

            // Update profile via API
            await api.put('/user/profile', {
                goal: planData.goal,
                budget: planData.budget,
            });

            setMessages(prev => [...prev, {
                role: 'ai',
                text: `✅ Plan applied successfully!\n\n🎯 Goal: ${planData.goal?.replace('_', ' ')}\n🔥 Target: ${planData.targetCalories} kcal/day\n💪 Protein: ${planData.protein}g/day\n🍞 Carbs: ${planData.carbs}g/day\n🥑 Fats: ${planData.fats}g/day\n💰 Budget: ${planData.budget}\n\nYour diet page and dashboard are now updated! Head to the Diet page to see your personalized meal plan. 🚀`
            }]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Failed to apply the plan. Please try again or update manually in your profile.' }]);
        }
        setApplying(false);
    };

    const clearChat = async () => {
        try { await api.delete('/chat/clear'); } catch { /* ok */ }
        setMessages([]);
    };

    // Don't render if not logged in
    if (typeof window !== 'undefined' && !localStorage.getItem('chandufit_token')) return null;

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
                        display: 'flex', alignItems: 'center', gap: 6,
                        cursor: 'pointer',
                        animation: 'chatLabelSlide 0.5s ease',
                    }}
                >
                    <div style={{
                        background: '#fff', borderRadius: 10,
                        padding: '6px 10px',
                        boxShadow: '0 2px 12px rgba(37,99,235,0.1)',
                        border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                        </svg>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>AI Coach</span>
                    </div>
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb, #3b82f6, #06b6d4)',
                        border: '2px solid #fff',
                        boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        animation: 'chatBtnPulse 3s ease-in-out infinite',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                        </svg>
                    </div>
                </div>
            )}
            {isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
                        width: 54, height: 54, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                        border: '3px solid #fff', cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    aria-label="Close AI Coach"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: 96, right: 24, zIndex: 9998,
                    width: 400, maxWidth: 'calc(100vw - 32px)', height: 560, maxHeight: 'calc(100vh - 120px)',
                    background: '#fff', borderRadius: 20, overflow: 'hidden',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column',
                    animation: 'chatSlideIn 0.3s ease',
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                        padding: '1rem 1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 12,
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.15)',
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>FitCoach AI</div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                                    Online · Ready to help
                                </div>
                            </div>
                        </div>
                        <button onClick={clearChat}
                            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', cursor: 'pointer', padding: '5px 12px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                            Reset
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '1rem',
                        display: 'flex', flexDirection: 'column', gap: 12,
                        background: '#f8faff',
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            }}>
                                <div style={{
                                    maxWidth: '85%',
                                    padding: '0.7rem 1rem',
                                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: msg.role === 'user'
                                        ? 'linear-gradient(135deg, #2563eb, #06b6d4)'
                                        : '#fff',
                                    color: msg.role === 'user' ? '#fff' : '#0f172a',
                                    fontSize: '0.875rem', lineHeight: 1.5,
                                    boxShadow: msg.role === 'user' ? '0 2px 8px rgba(37,99,235,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
                                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                }}>
                                    {msg.text}
                                    {/* Apply Plan Button */}
                                    {msg.planData && (
                                        <button
                                            onClick={() => applyPlan(msg.planData)}
                                            disabled={applying}
                                            style={{
                                                display: 'block', width: '100%', marginTop: 10,
                                                padding: '0.65rem', borderRadius: 10, border: 'none',
                                                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                                                color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                                                cursor: applying ? 'wait' : 'pointer',
                                                boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                                                opacity: applying ? 0.7 : 1,
                                            }}>
                                            {applying ? '⏳ Applying...' : '✨ Apply This Plan to My Account'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    padding: '0.7rem 1.2rem', borderRadius: '16px 16px 16px 4px',
                                    background: '#fff', border: '1px solid #e2e8f0',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                }}>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} style={{
                                                width: 8, height: 8, borderRadius: '50%', background: '#94a3b8',
                                                animation: `typingPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '0.75rem 1rem', borderTop: '1px solid #e2e8f0',
                        background: '#fff', display: 'flex', gap: 8,
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about workouts, diet, exercises..."
                            disabled={loading}
                            style={{
                                flex: 1, padding: '0.65rem 0.9rem', borderRadius: 12,
                                border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem',
                                color: '#0f172a', background: '#f8faff',
                                transition: 'border 0.2s',
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            style={{
                                width: 42, height: 42, borderRadius: 12, border: 'none',
                                background: input.trim() ? 'linear-gradient(135deg, #2563eb, #06b6d4)' : '#e2e8f0',
                                color: input.trim() ? '#fff' : '#94a3b8',
                                cursor: input.trim() ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', transition: 'all 0.2s', flexShrink: 0,
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Animations */}
            <style jsx global>{`
                @keyframes chatSlideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes typingPulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                @keyframes chatBtnPulse {
                    0%, 100% { box-shadow: 0 6px 28px rgba(37,99,235,0.45), 0 0 0 4px rgba(37,99,235,0.08); }
                    50% { box-shadow: 0 6px 32px rgba(37,99,235,0.55), 0 0 0 8px rgba(37,99,235,0.06); }
                }
                @keyframes chatLabelSlide {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </>
    );
}

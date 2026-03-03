import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

const FitnessChat = dynamic(() => import('@/components/FitnessChat'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'FitTracker — Your Personal Fitness Tracker',
    description: 'AI-powered diet, workout, and discipline tracking platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#fff',
                            color: '#1e293b',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 20px rgba(37,99,235,0.08)',
                            fontFamily: 'Inter, sans-serif',
                        },
                    }}
                />
                {children}
                <FitnessChat />
            </body>
        </html>
    )
}

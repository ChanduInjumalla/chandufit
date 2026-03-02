import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'ChanduFit Global — Track Your Discipline',
    description: 'Personal AI-based Diet & Workout Tracking Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1A1A1A',
                            color: '#F0F0F0',
                            border: '1px solid #2A2A2A',
                        },
                    }}
                />
                {children}
            </body>
        </html>
    )
}

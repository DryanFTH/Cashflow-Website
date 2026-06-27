import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { GridBackground } from '@/components/ui/GridBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Cashflow — Personal Finance Dashboard',
    description: 'Aplikasi pencatatan dan analisis keuangan pribadi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" className="dark" suppressHydrationWarning>
            <body className={`${inter.className} bg-background text-foreground antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    forcedTheme="dark"
                    enableSystem={false}
                >
                    <QueryProvider>
                        <div className="flex min-h-screen">
                            <Sidebar />
                            <main
                                className="relative flex-1 overflow-y-auto p-6 md:p-8"
                                style={{
                                    background:
                                        'radial-gradient(circle at top left, rgba(255,255,255,.12), transparent 40%), radial-gradient(circle at bottom right, rgba(255,255,255,.12), transparent 40%), #090909',
                                }}
                            >
                                <GridBackground />
                                {children}
                            </main>
                        </div>
                        <Toaster richColors />
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

import type { Metadata } from 'next';
import { Poppins, Inter, Lora } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FreshResume - Build job-ready resumes in seconds',
  description:
    'AI-powered resumes tailored for every job. Land your dream role with minimal effort.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClasses = [poppins.className, "min-h-screen", "flex", "flex-col"].join(" ");

  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className={bodyClasses} suppressHydrationWarning>
        <div className="flex-1 flex flex-col relative">
          <AppProviders>
            {children}
            <Toaster position="bottom-right" />
          </AppProviders>
        </div>
      </body>
    </html>
  );
}

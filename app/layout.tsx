import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'KPS Worldwide Logistics Pvt. Ltd. | Global Supply Chains. Engineered to Scale.',
  description: 'KPS Worldwide Logistics Pvt. Ltd. is a premier logistics and freight forwarding company in Chennai, India, providing containerized cargo (FCL/LCL), project cargo, break bulk, RoRo, ODC heavy transport, licensed customs brokerage, and industrial warehousing.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col overflow-x-hidden bg-white text-[#212529]">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

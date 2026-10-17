import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AnnouncementBar from '@/components/common/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuotePopup from '@/components/common/QuotePopup';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import WebinarRegistrationModal from '@/components/common/WebinarRegistrationModal';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'KPS Worldwide Logistics Pvt. Ltd. | Global Supply Chains. Engineered to Scale.',
  description: 'KPS Worldwide Logistics Pvt. Ltd. is a premier logistics and freight forwarding company in Chennai, India, providing containerized cargo (FCL/LCL), project cargo, break bulk, RoRo, ODC heavy transport, licensed customs brokerage, and industrial warehousing.',
  icons: {
    icon: '/images/kpslogo-tab.webp',
    shortcut: '/images/kpslogo-tab.webp',
    apple: '/images/kpslogo-tab.webp',
  },
};

// Runs before first paint: if the last visit had active announcements, reserve the bar's space
// right away so the page doesn't jump down when the bar mounts. AnnouncementBar keeps it in sync.
const reserveAnnouncementSpace = `try{var c=JSON.parse(localStorage.getItem('kps-announcements-v2')||'null');if(c&&c.items&&c.items.length&&location.pathname.indexOf('/admin')!==0)document.documentElement.setAttribute('data-announcement','true')}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: reserveAnnouncementSpace }} />
      </head>
      <body className="font-sans min-h-screen flex flex-col overflow-x-hidden bg-white text-[#212529]" suppressHydrationWarning>
        <AnnouncementBar />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <QuotePopup />
        <WebinarRegistrationModal />
        <WhatsAppButton />
      </body>
    </html>
  );
}

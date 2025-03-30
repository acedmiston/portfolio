import Header from '@/components/header';
import './globals.css';
import { Inter } from 'next/font/google';
import ActiveSectionContextProvider from '@/context/active-section-context';
import Footer from '@/components/footer';
import ThemeSwitch from '@/components/theme-switch';
import ThemeContextProvider from '@/context/theme-context';
import ChatWrapper from '@/components/chat/ChatWrapper';
import { LanguageProvider } from '@/providers/language-provider';
import LanguageSelector from '@/components/language-selector';
import MetaUpdater from '@/components/meta-updater';
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('locale');
  const initialLocale = localeCookie?.value || 'en';

  return (
    <html lang={initialLocale} className="!scroll-smooth">
      <body
        className={`${inter.className} relative bg-gray-50 text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 pt-0 sm:pt-36`}
      >
        <LanguageProvider>
          <MetaUpdater />
          <ThemeContextProvider>
            <ActiveSectionContextProvider>
              <div className="absolute right-[11rem] top-[-6rem] -z-10 h-[31.25rem] w-[31.25rem] rounded-full bg-[#fbe2e3] blur-[10rem] dark:bg-[#946263] sm:w-[68.75rem]" />
              <div className="absolute left-[-35rem] top-[-1rem] -z-10 h-[31.25rem] w-[50rem] rounded-full bg-[#dbd7fb] blur-[10rem] dark:bg-[#676394] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]" />
              <Header />
              <LanguageSelector />
              <ThemeSwitch />
              {children}
              <Footer />
              <ChatWrapper />
              <Toaster position="top-center" theme="system" />
            </ActiveSectionContextProvider>
          </ThemeContextProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

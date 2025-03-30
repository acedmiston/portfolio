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
import MetaUpdater from '@/components/MetaUpdater';
import { cookies } from 'next/headers';

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
        className={`${inter.className} relative bg-gray-50 pt-28 text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 sm:pt-36`}
      >
        <div className="absolute right-[11rem] top-[-6rem] -z-10 h-[31.25rem] w-[31.25rem] rounded-full bg-[#fbe2e3] blur-[10rem] dark:bg-[#946263] sm:w-[68.75rem]"></div>
        <div className="absolute left-[-35rem] top-[-1rem] -z-10 h-[31.25rem] w-[50rem] rounded-full bg-[#dbd7fb] blur-[10rem] dark:bg-[#676394] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
        <LanguageProvider>
          <MetaUpdater />
          <ThemeContextProvider>
            <ActiveSectionContextProvider>
              <Header />
              <LanguageSelector />
              {children}
              <Footer />
              <ThemeSwitch />
              <ChatWrapper />
            </ActiveSectionContextProvider>
          </ThemeContextProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

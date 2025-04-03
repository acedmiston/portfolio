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
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';
import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  let messages;
  try {
    messages = await getMessages({ locale: params.locale });
  } catch (error) {
    messages = await getMessages({ locale: 'en' });
  }

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      images: [
        {
          url: '/PortfolioScreenshot.png',
          width: 1200,
          height: 630,
          alt: messages.meta.title,
        },
      ],
      type: 'website',
      locale: params.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.meta.title,
      description: messages.meta.description,
      images: ['/PortfolioScreenshot.png'],
    },
  };
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'pt' },
  ];
}

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
        className={`${inter.className} relative bg-gray-50 pt-0 text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 sm:pt-36`}
      >
        <LanguageProvider>
          <ThemeContextProvider>
            <ActiveSectionContextProvider>
              <div className="absolute -top-24 right-44 -z-10 h-[31.25rem] w-[31.25rem] rounded-full bg-[#fbe2e3] blur-[10rem] dark:bg-[#946263] sm:w-[68.75rem]" />
              <div className="absolute -top-4 left-[-35rem] -z-10 h-[31.25rem] w-[50rem] rounded-full bg-[#dbd7fb] blur-[10rem] dark:bg-[#676394] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:-left-60 2xl:-left-20" />
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

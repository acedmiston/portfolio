import React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

type ContactFormEmailProps = {
  message: string;
  senderEmail: string;
  senderName: string;
  locale?: 'en' | 'fr' | 'es' | 'pt';
  timestamp?: string;
};

const emailTranslations = {
  en: {
    preview: 'New message from your portfolio site',
    heading: 'You received the following message from the contact form',
    senderNameLabel: "The sender's name is:",
    senderEmailLabel: "The sender's email is:",
  },
  fr: {
    preview: 'Nouveau message de votre site portfolio',
    heading: 'Vous avez reçu le message suivant du formulaire de contact',
    senderNameLabel: "Le nom de l'expéditeur est :",
    senderEmailLabel: "L'email de l'expéditeur est :",
  },
  es: {
    preview: 'Nuevo mensaje desde tu sitio de portafolio',
    heading: 'Has recibido el siguiente mensaje del formulario de contacto',
    senderNameLabel: 'El nombre del remitente es:',
    senderEmailLabel: 'El correo electrónico del remitente es:',
  },
  pt: {
    preview: 'Nova mensagem do seu site portfólio',
    heading: 'Você recebeu a seguinte mensagem do formulário de contato',
    senderNameLabel: 'O nome do remetente é:',
    senderEmailLabel: 'O email do remetente é:',
  },
};

export default function ContactFormEmail({
  message,
  senderEmail,
  senderName,
  locale = 'en',
  timestamp,
}: ContactFormEmailProps) {
  const t = emailTranslations[locale];

  const languageEmoji = {
    en: '🇺🇸',
    fr: '🇫🇷',
    es: '🇪🇸',
    pt: '🇧🇷',
  }[locale];

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Tailwind>
        <Body className="text-black bg-gray-100">
          <Container>
            <Section className="p-6 bg-white border border-gray-200 rounded-lg">
              <div
                style={{
                  backgroundColor:
                    locale === 'fr'
                      ? '#002654'
                      : locale === 'es'
                        ? '#AA151B'
                        : locale === 'pt'
                          ? '#009b3a'
                          : '#0a3161',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>
                  {languageEmoji} {locale.toUpperCase()} -{' '}
                  {timestamp || new Date().toISOString()}
                </Text>
              </div>
              <Heading className="text-2xl font-bold">{t.heading}</Heading>
              <Text className="mt-2 text-gray-700 whitespace-pre-wrap">
                {message}
              </Text>
              <Hr />
              <Text>
                {t.senderNameLabel} <strong>{senderName}</strong>
              </Text>
              <Text>
                {t.senderEmailLabel} <strong>{senderEmail}</strong>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

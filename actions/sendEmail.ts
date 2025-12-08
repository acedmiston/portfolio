'use server';

import React from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { validateString, getErrorMessage } from '@/lib/utils';
import ContactFormEmail from '@/email/contact-form-email';
import { cookies } from 'next/headers';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailState = { error?: string; data?: unknown } | null;

export const sendEmail = async (
  _prevState: EmailState,
  formData: FormData
): Promise<EmailState> => {
  const senderEmail = formData.get('senderEmail') as string;
  const message = formData.get('message') as string;
  const senderName = formData.get('senderName') as string;

  // Get locale from form data (passed from client) or fall back to cookies
  const formLocale = formData.get('formLocale') as string;
  const cookieStore = await cookies();
  const locale = (formLocale || cookieStore.get('locale')?.value || 'en') as
    | 'en'
    | 'fr'
    | 'es'
    | 'pt';

  // Validate input with more descriptive errors based on locale
  const errorMessages = {
    en: {
      email: 'Invalid sender email',
      name: 'Invalid sender name',
      message: 'Invalid message',
    },
    fr: {
      email: "Email de l'expéditeur invalide",
      name: "Nom de l'expéditeur invalide",
      message: 'Message invalide',
    },
    es: {
      email: 'Correo electrónico del remitente no válido',
      name: 'Nombre de remitente no válido',
      message: 'Mensaje no válido',
    },
    pt: {
      email: 'Email do remetente inválido',
      name: 'Nome do remetente inválido',
      message: 'Mensagem inválida',
    },
  };

  // Validate with locale-specific error messages
  if (!validateString(senderEmail, 500)) {
    return { error: errorMessages[locale].email };
  }
  if (!validateString(senderName, 500)) {
    return { error: errorMessages[locale].name };
  }
  if (!validateString(message, 5000)) {
    return { error: errorMessages[locale].message };
  }

  // Add email metadata based on locale
  const subjectLines = {
    en: 'Message from contact form',
    fr: 'Message du formulaire de contact',
    es: 'Mensaje del formulario de contacto',
    pt: 'Mensagem do formulário de contato',
  };

  // Get timestamp in user's locale format for email tracking
  const timestamp = new Date().toLocaleString(
    locale === 'en'
      ? 'en-US'
      : locale === 'fr'
        ? 'fr-FR'
        : locale === 'es'
          ? 'es-ES'
          : 'pt-BR'
  );

  try {
    // Render the React email component to HTML
    const emailHtml = await render(
      React.createElement(ContactFormEmail, {
        message: message,
        senderEmail: senderEmail,
        senderName: senderName,
        locale: locale,
        timestamp: timestamp,
      })
    );

    // Send email with locale-aware subject and component
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'aaroncedmistondev@gmail.com',
      subject: `${subjectLines[locale]} (${locale.toUpperCase()})`,
      reply_to: senderEmail,
      html: emailHtml,
    });

    return { data };
  } catch (error: unknown) {
    console.error('Email sending failed:', error);
    return {
      error: getErrorMessage(error),
    };
  }
};

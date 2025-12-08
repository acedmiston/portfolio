'use client';

import React, { useEffect, useRef, useActionState } from 'react';
import SectionHeading from './section-heading';
import { useSectionInView } from '@/lib/hooks';
import { motion } from 'framer-motion';
import { sendEmail } from '@/actions/sendEmail';
import SubmitBtn from './submit-button';
import { toast } from 'sonner';
import { useLanguage } from '@/providers/language-provider';

const Contact = () => {
  const { ref } = useSectionInView('nav.contact');
  const { t, locale } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(sendEmail, null);
  const lastProcessedStateRef = useRef<typeof state>(null);

  useEffect(() => {
    // Reset tracking when state becomes null (new form submission started)
    if (!state) {
      lastProcessedStateRef.current = null;
      return;
    }

    // Only process if this is a new state (not already processed)
    if (lastProcessedStateRef.current === state) return;

    // Mark this state as processed
    lastProcessedStateRef.current = state;

    if (state.error) {
      toast.error(t('contact.errorMessage'), {
        description: state.error,
        duration: 5000,
      });
      console.error('Email send error:', state.error);
    } else if (state.data) {
      if (formRef.current) {
        formRef.current.reset();
      }
      toast.success(t('contact.successMessage'), {
        description: t('contact.responseTime'),
        duration: 3000,
      });
    }
  }, [state, t]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      id="contact"
      ref={ref}
      className="mb-20 w-[min(100%,38rem)] text-center sm:mb-28"
    >
      <SectionHeading>{t('contact.title')}</SectionHeading>
      <p className="-mt-6 text-gray-700 dark:text-white/80">
        {t('contact.subtitle')}
        <a
          className="underline"
          href="mailto:aaroncedmistondev@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('contact.emailAddress')}
        </a>{' '}
        {t('contact.subtitle2')}
      </p>
      <form
        ref={formRef}
        id="form"
        className="mt-10 flex flex-col dark:text-black"
        action={formAction}
      >
        <input
          className="borderBlack dark:bg-opacity/80 dark:focus:bg-opacity/100 mb-3 h-14 rounded-lg px-4 transition-all dark:bg-white dark:outline-none"
          name="senderName"
          id="senderName"
          type="name"
          required
          placeholder={t('contact.nameLabel')}
        />
        <input
          className="borderBlack dark:bg-opacity/80 dark:focus:bg-opacity/100 h-14 rounded-lg px-4 transition-all dark:bg-white dark:outline-none"
          name="senderEmail"
          id="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder={t('contact.emailLabel')}
        />
        <textarea
          className="borderBlack dark:bg-opacity/80 dark:focus:bg-opacity/100 my-3 h-52 rounded-lg p-4 transition-all dark:bg-white dark:outline-none"
          name="message"
          id="message"
          placeholder={t('contact.messageLabel')}
          required
          maxLength={5000}
        />
        <input type="hidden" name="formLocale" value={locale} />
        <SubmitBtn />
      </form>
    </motion.section>
  );
};

export default Contact;

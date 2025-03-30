'use client';

import React, { FormEvent, useRef } from 'react';
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Show pending toast while sending
    toast.loading(t('contact.sending'));

    const formData = new FormData(event.currentTarget);

    // Track form submission language for analytics
    formData.append('formLocale', locale);

    const { error } = await sendEmail(formData);

    // Dismiss the loading toast
    toast.dismiss();

    if (error) {
      toast.error(t('contact.errorMessage'), {
        description: error,
        duration: 5000,
      });
      console.error('Email send error:', error);
      return;
    }

    if (formRef.current) {
      formRef.current.reset();
    }

    toast.success(t('contact.successMessage'), {
      description: t('contact.responseTime'),
      duration: 3000,
    });
  };

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
        className="flex flex-col mt-10 dark:text-black"
        onSubmit={handleSubmit}
      >
        <input
          className="px-4 mb-3 transition-all rounded-lg borderBlack h-14 dark:bg-white dark:bg-opacity-80 dark:outline-none dark:focus:bg-opacity-100"
          name="senderName"
          id="senderName"
          type="name"
          required
          placeholder={t('contact.nameLabel')}
        />
        <input
          className="px-4 transition-all rounded-lg borderBlack h-14 dark:bg-white dark:bg-opacity-80 dark:outline-none dark:focus:bg-opacity-100"
          name="senderEmail"
          id="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder={t('contact.emailLabel')}
        />
        <textarea
          className="p-4 my-3 transition-all rounded-lg borderBlack h-52 dark:bg-white dark:bg-opacity-80 dark:outline-none dark:focus:bg-opacity-100"
          name="message"
          id="message"
          placeholder={t('contact.messageLabel')}
          required
          maxLength={5000}
        />
        <SubmitBtn />
      </form>
    </motion.section>
  );
};

export default Contact;

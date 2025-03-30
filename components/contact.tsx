'use client';

import React, { FormEvent, useRef } from 'react';
import SectionHeading from './section-heading';
import { useSectionInView } from '@/lib/hooks';
import { motion } from 'framer-motion';
import { sendEmail } from '@/actions/sendEmail';
import SubmitBtn from './submit-button';
import toast from 'react-hot-toast';
import { useLanguage } from '@/providers/language-provider';

const Contact = () => {
  const { ref } = useSectionInView('nav.contact');
  const { t } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const { error } = await sendEmail(formData);

    if (error) {
      toast.error(t('contact.errorMessage'));
      console.error('Email send error:', error);
      return;
    }

    if (formRef.current) {
      formRef.current.reset();
    }
    toast.success(t('contact.successMessage'));
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
        className="mt-10 flex flex-col dark:text-black"
        onSubmit={handleSubmit}
      >
        <input
          className="borderBlack mb-3 h-14 rounded-lg px-4 transition-all dark:bg-white dark:bg-opacity-80 dark:outline-none dark:focus:bg-opacity-100"
          name="senderName"
          id="senderName"
          type="name"
          required
          placeholder={t('contact.nameLabel')}
        />
        <input
          className="borderBlack h-14 rounded-lg px-4 transition-all dark:bg-white dark:bg-opacity-80 dark:outline-none dark:focus:bg-opacity-100"
          name="senderEmail"
          id="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder={t('contact.emailLabel')}
        />
        <textarea
          className="borderBlack my-3 h-52 rounded-lg p-4 transition-all dark:bg-white dark:bg-opacity-80 dark:outline-none dark:focus:bg-opacity-100"
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

"use client";

import React, { FormEvent, useRef } from "react";
import SectionHeading from "./section-heading";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";
import { sendEmail } from "@/actions/sendEmail";
import SubmitBtn from "./submit-button";
import toast from "react-hot-toast";

const Contact = () => {
  const { ref } = useSectionInView("Contact");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const { data, error } = await sendEmail(formData);

    if (error) {
      toast.error(error);
      return;
    }
    if (formRef.current) {
      formRef.current.reset();
    }
    toast.success("Message sent!");
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
    >
      <SectionHeading>Contact me</SectionHeading>
      <p className="text-gray-700 -mt-6 dark:text-white/80">
        Please reach out to me directly at{" "}
        <a
          className="underline"
          href="mailto:aaroncedmistondev@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          aaroncedmistondev@gmail.com
        </a>{" "}
        or through this form:
      </p>
      <form
        ref={formRef}
        id="form"
        className="mt-10 flex flex-col dark:text-black"
        onSubmit={handleSubmit}
      >
        <input
          className="h-14 px-4 mb-3 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="senderName"
          id="senderName"
          type="name"
          required
          placeholder="Your name"
        />
        <input
          className="h-14 px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="senderEmail"
          id="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder="Your email"
        />
        <textarea
          className="h-52 my-3 rounded-lg borderBlack p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          name="message"
          id="message"
          placeholder="Your message"
          required
          maxLength={5000}
        />
        <SubmitBtn />
      </form>
    </motion.section>
  );
};

export default Contact;

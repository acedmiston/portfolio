import React from 'react';

const Footer = () => {
  return (
    <footer className="px-4 mb-10 text-center text-gray-500">
      <small className="block mb-2 text-xs">
        &copy; Aaron Edmiston {new Date().getFullYear()} All rights reserved.
      </small>
      <p className="text-xs">
        <span className="font-semibold">About this website:</span> built with
        React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS,
        Framer Motion, Material UI, Vercel hosting,
        <br />
        and enhanced with dynamicAI-powered chat using OpenAI, semantic query
        matching, and contextual response generation for personalized
        interactions.
      </p>
    </footer>
  );
};

export default Footer;

# Aaron Edmiston's Portfolio

A modern, responsive portfolio website built with Next.js and React that showcases my professional experience, projects, and skills.

![Portfolio Screenshot](/PortfolioScreenshot.png)

## 🚀 Features

- **Interactive Chat Assistant:** Chat with a portfolio assistant using a custom-built chat interface
- **Light/Dark Mode:** Seamless theme switching with persistence
- **Interactive Timeline:** Visual representation of professional experience
- **Responsive Design:** Mobile-first approach for all screen sizes
- **Modern UI:** Clean, minimalist design with smooth animations
- **Server-Side Rendering:** Fast load times with Next.js
- **Optimized Images:** Efficient image loading for better performance

## 🛠️ Technology Stack

- **Framework:** Next.js 13 with App Router
- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS, MUI Components
- **Animations:** Framer Motion
- **Icons:** React Icons
- **State Management:** React Context API
- **Linting:** ESLint, Prettier
- **Deployment:** Vercel

## 📋 Project Structure

```
portfolio/
├── app/              # Next.js app router files
│   └── api/          # API routes including chat endpoint
├── components/       # Reusable UI components
│   ├── chat/         # Chat interface components
│   └── ...           # Other UI components
├── context/          # React Context providers
├── lib/              # Utility functions and data
│   └── hooks.ts      # Custom React hooks
├── public/           # Static assets
└── styles/           # Global CSS files
```

## 💻 Setup and Development

### Prerequisites

- Node.js 16.8+
- Yarn or npm

### Installation

- Clone the repository

```
git clone https://github.com/acedmiston/portfolio
cd portfolio
```

- Install dependencies

```
yarn install
# or
npm install
```

- Start the development server

```
yarn dev
# or
npm run dev
```

- Open http://localhost:3000 in your browser

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
RESEND_API_KEY=your-resend-api-key
OPENAI_API_KEY=your-openai-api-key
```

## 📱 Key Components

- **Interactive Chat:** Custom-built chat interface with personalized assistant avatar
- **Experience Timeline:** Material UI-based timeline showing professional history
- **Theme Switch:** Toggle between light and dark mode with theme persistence
- **Contact Form:** Email contact form using Resend API

## 🚀 Deployment

This project is configured for easy deployment on Vercel:

- Push to GitHub
- Connect repository to Vercel
- Configure environment variables
- Deploy

## 📝 License

MIT © Aaron Edmiston 2025

## 🙏 Acknowledgements

- Next.js Team for the excellent framework
- Material UI for timeline components
- Tailwind CSS for styling utilities
- All open-source contributors of packages used

Designed and developed by Aaron Edmiston © 2024 - 2025

---

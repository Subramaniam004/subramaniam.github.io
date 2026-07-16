# Portfolio Website

A modern portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- ⚡ **Next.js 14** - Latest Next.js with App Router
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🎬 **Framer Motion** - Smooth animations
- 📱 **Responsive Design** - Mobile-friendly
- 🌙 **Dark Theme** - Modern dark aesthetic
- ⚡ **Terminal Hero Section** - Unique intro experience
- 📝 **Blog Section** - MDX support ready
- 🚀 **Optimized** - Fast loading and SEO friendly

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Deploy on Vercel

```bash
npm install -g vercel
vercel
```

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Experience.tsx
│   └── Contact.tsx
└── lib/             # Utility functions
```

## Customization

1. Update personal information in `src/app/page.tsx`
2. Customize colors in `tailwind.config.ts`
3. Add your projects to `Projects.tsx`
4. Update experience details in `Experience.tsx`
5. Add social links in components

## Technologies

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- React 18

## License

MIT License - feel free to use this template

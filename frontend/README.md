# GlowVault Frontend

A modern React + Vite + Tailwind CSS frontend application.

## Setup

### Installation

Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx           # Application entry point
│   ├── App.tsx            # Main App component
│   ├── App.css            # App styles
│   └── index.css          # Global styles with Tailwind directives
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── package.json           # Dependencies and scripts
└── .gitignore             # Git ignore rules
```

## Features

- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Hot Module Replacement (HMR)** - Fast refresh during development

## API Proxy

The dev server is configured to proxy API requests to `http://localhost:3000`. Any requests to `/api/*` will be forwarded to the backend:

```javascript
// Frontend
const response = await fetch('/api/endpoint');

// Will be proxied to
// http://localhost:3000/endpoint
```

## Browser Support

- Modern browsers with ES2020 support

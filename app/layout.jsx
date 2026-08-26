import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import AppProviders from '@/providers/AppProviders';

export const metadata = {
  title: "Fahara • Cafe & Event Booking Platform",
  description: "Book top-rated cafes, private venues, and event spaces near you.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/Fahara%20Logo.jpeg', type: 'image/jpeg' },
    ],
    shortcut: '/Fahara%20Logo.jpeg',
    apple: '/Fahara%20Logo.jpeg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/Fahara%20Logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/Fahara%20Logo.jpeg" />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Free Finance Tools for UAE Businesses | Epiidosis Global Finance',
  description:
    'Assess your financing options with Epiidosis Global Finance’s free tools. Get instant eligibility insights for credit lines, mortgages, trade, and project finance in the UAE.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

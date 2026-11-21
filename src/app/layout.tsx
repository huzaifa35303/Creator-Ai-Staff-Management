import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CreatorAI — Staff Management Portal',
  description: 'Private team workspace for managing people, roles, departments, work, recruitment and internal operations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-app-bg text-brand-text min-h-screen antialiased selection:bg-brand-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}

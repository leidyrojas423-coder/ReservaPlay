import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReservaPlay - Login',
  description: 'Inicia sesión en ReservaPlay',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

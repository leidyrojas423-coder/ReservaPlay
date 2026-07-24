import type { Metadata } from 'next';
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Aside from "./components/Aside";
import Footer from "./components/Footer";

import './globals.css';

import { AuthProvider } from './providers';

export const metadata: Metadata = {
  title: 'ReservaPlay',
  description: 'ReservaPlay estructura principal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>

          <Header />

          <Navbar />

          <Aside />

          <main>
            {children}
          </main>

          <Footer />

        </AuthProvider>
      </body>
    </html>
  );
}
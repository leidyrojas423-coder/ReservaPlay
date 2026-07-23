import type { Metadata } from 'next';
import Header from "./components/Header";
import Aside from "./components/Aside";
import Footer from "./components/Footer";

import './globals.css';

import { AuthProvider } from './providers';

export const metadata: Metadata = {
  title: 'ReservaPlay',
  description: 'ReservaPlay estructura principal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <div className="app-shell">

<Header />

            <div className="page-body">
<Aside />

              <main className="page-main">{children}</main>
            </div>

            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

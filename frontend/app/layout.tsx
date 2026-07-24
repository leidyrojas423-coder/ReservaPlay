import type { Metadata } from "next";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./globals.css";

import { AuthProvider } from "./providers";

export const metadata: Metadata = {
  title: "ReservaPlay",
  description: "Reserva tu cancha fácilmente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <div className="app-shell">
            <Header />
            <Navbar />

            <div className="page-body">
              <main className="page-main">{children}</main>
            </div>

            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
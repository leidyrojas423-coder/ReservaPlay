import type { Metadata } from "next";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

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

            <footer className="page-footer">
              <p>
                © {new Date().getFullYear()} ReservaPlay. Todos los derechos
                reservados.
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
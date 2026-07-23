import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/Header";
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

            <main>
              {children}
            </main>

          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
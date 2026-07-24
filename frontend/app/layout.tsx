import type { Metadata } from "next";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Aside from "./components/Aside";
<<<<<<< HEAD
import Footer from "./components/Footer";
=======
>>>>>>> bf164fcfc111077981523662cb8b034c5f6598a0

import "./globals.css";

import { AuthProvider } from "./providers";

export const metadata: Metadata = {
  title: "ReservaPlay",
  description: "Reserva tu cancha fácilmente",
};

export default function RootLayout({
  children,
<<<<<<< HEAD
}: {
  children: React.ReactNode;
}) {
=======
}: Readonly<{
  children: React.ReactNode;
}>) {
>>>>>>> bf164fcfc111077981523662cb8b034c5f6598a0
  return (
    <html lang="es">
      <body>
        <AuthProvider>
<<<<<<< HEAD

          <Header />

          <Navbar />

          <Aside />

          <main>
            {children}
          </main>

          <Footer />

=======
          <div className="app-shell">
            <Header />

            <div className="page-body">
              <Navbar />

              <Aside />

              <main className="page-main">
                {children}
              </main>
            </div>

            <footer className="page-footer">
              <p>
                © {new Date().getFullYear()} ReservaPlay. Todos los derechos
                reservados.
              </p>
            </footer>
          </div>
>>>>>>> bf164fcfc111077981523662cb8b034c5f6598a0
        </AuthProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "./providers";


export const metadata: Metadata = {
  title: "ReservaPlay",
  description: "ReservaPlay plataforma de reservas",
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

          {children}

        </AuthProvider>

      </body>

    </html>

  );

}
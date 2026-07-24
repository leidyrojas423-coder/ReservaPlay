import Link from "next/link";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <>
      {/* Header */}
      <header
        style={{
          height: "70px",
          background: "#111827",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
        }}
      >
        <h2>⚽ ReservaPlay</h2>
        <span>Panel Administrativo</span>
      </header>

      {/* Contenedor principal */}
      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        {/* Menú lateral */}
        <aside
          style={{
            width: "260px",
            background: "#1f2937",
            color: "white",
            padding: "20px",
          }}
        >
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Link
              href="/dashboard"
              style={{ color: "white", textDecoration: "none" }}
            >
              Dashboard
            </Link>

            <Link
              href="/admin/users"
              style={{ color: "white", textDecoration: "none" }}
            >
              Usuarios
            </Link>

            <Link
              href="/admin/canchas"
              style={{ color: "white", textDecoration: "none" }}
            >
              Canchas
            </Link>

            <Link
              href="/admin/horarios"
              style={{ color: "white", textDecoration: "none" }}
            >
              Horarios
            </Link>

            <Link
              href="/admin/reservas"
              style={{ color: "white", textDecoration: "none" }}
            >
              Reservas
            </Link>

            <Link
              href="/admin/estados-reservas"
              style={{ color: "white", textDecoration: "none" }}
            >
              Estados de Reservas
            </Link>
          </nav>
        </aside>

        {/* Contenido */}
        <main
          style={{
            flex: 1,
            padding: "30px",
            background: "#f4f4f4",
          }}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer
        style={{
          height: "50px",
          background: "#111827",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        © 2026 ReservaPlay - Todos los derechos reservados
      </footer>
    </>
  );
}

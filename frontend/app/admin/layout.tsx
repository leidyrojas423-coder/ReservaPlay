import Link from "next/link";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Menú lateral */}
      <aside
        style={{
          width: "260px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>⚽ ReservaPlay</h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Link href="/dashboard" style={{ color: "white" }}>
            Dashboard
          </Link>

          <Link href="/admin/users" style={{ color: "white" }}>
            Usuarios
          </Link>

          <Link href="/admin/canchas" style={{ color: "white" }}>
            Canchas
          </Link>

          <Link href="/admin/horarios" style={{ color: "white" }}>
            Horarios
          </Link>

          <Link href="/admin/reservas" style={{ color: "white" }}>
            Reservas
          </Link>

          <Link href="/admin/estados-reservas" style={{ color: "white" }}>
            Estados
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
  );
}
import Link from "next/link";

export default function Aside() {
  return (
    <aside
      style={{
        width: "180px",
        minHeight: "100%",
        backgroundColor: "#ffffff",
        padding: "28px 20px",
        borderLeft: "1px solid #e5e7eb",
        marginRight: "16px",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "20px",
          color: "#0f172a",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        Administración
      </h3>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/admin/canchas">Gestionar Canchas</Link>
        <Link href="/admin/reservas">Gestionar Reservas</Link>
        <Link href="/admin/horarios">Horarios</Link>
        <Link href="/admin/users">Usuarios</Link>
      </nav>
    </aside>
  );
}
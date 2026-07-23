import AdminSessionBar from "./admin-session-bar";

export default function Header() {
  return (
    <header className="page-header">
      <div className="page-header__content">
        <div>
          <p className="eyebrow">Panel principal</p>
          <h1>Bienvenido a ReservaPlay</h1>
        </div>

        <AdminSessionBar />
      </div>
    </header>
  );
}
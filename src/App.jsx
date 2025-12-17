import React from "react";
import ListItemsPage from "./ListItemsPage";

import "./styles.css";

export default function App() {
  return (
    <div className="container">
      <header className="header">Header</header>
      <nav className="menu">Menú</nav>
      <main className="content">
        <ListItemsPage />
      </main>
      <footer className="footer">Footer</footer>
    </div>
  );
}

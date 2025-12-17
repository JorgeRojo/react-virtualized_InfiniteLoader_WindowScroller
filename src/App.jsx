import React, { useRef, useEffect, useState } from "react";
import ListItemsPage from "./ListItemsPage";

import "./styles.css";

export default function App() {
  const contentRef = useRef(null);
  const [customElement, setCustomElement] = useState(null);

  useEffect(() => {
    if (contentRef.current) {
      setCustomElement(contentRef.current);
    }
  }, []);

  return (
    <div className="container">
      <header className="header">Header</header>
      <nav className="menu">Menú</nav>{" "}
      <main className="content" ref={contentRef}>
        <ListItemsPage customElement={customElement} />
      </main>
      <footer className="footer">Footer</footer>
    </div>
  );
}

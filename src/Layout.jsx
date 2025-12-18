import React, { useRef, useEffect, useState } from "react";
import PageWindowScroller from "./PageWindowScroller";

import "./Layout.css";

export default function Layout() {
  const layoutMainRef = useRef(null);
  const [layoutMainHtmlElement, setLayoutMainHtmlElement] = useState(null);

  useEffect(() => {
    if (layoutMainRef.current) {
      setLayoutMainHtmlElement(layoutMainRef.current);
    }
  }, []);

  return (
    <div className="layout-container">
      <header className="layout-header">Header</header>
      <nav className="layout-menu">Menú</nav>{" "}
      <main className="layout-main" ref={layoutMainRef}>
        <PageWindowScroller layoutMainHtmlElement={layoutMainHtmlElement} />
      </main>
      <footer className="layout-footer">Footer</footer>
    </div>
  );
}

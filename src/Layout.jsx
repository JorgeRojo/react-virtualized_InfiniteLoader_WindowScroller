import React, { useRef, useEffect, useState } from "react";
import PageWindowScroller from "./PageWindowScroller";

import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout-container">
      <header className="layout-header">Header</header>
      <nav className="layout-menu">Menú</nav>{" "}
      <main className="layout-main">
        <PageWindowScroller />
      </main>
      <footer className="layout-footer">Footer</footer>
    </div>
  );
}
